package com.ezone.dashboard.service;

import com.ezone.dashboard.dto.*;
import com.ezone.dashboard.entity.*;
import com.ezone.dashboard.repository.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Core business logic for the Day Wise Attendance feature.
 *
 * Data flow:
 *  1. Authenticate student ownership (loginId from JWT, never from request params)
 *  2. Resolve full multi-tenant context (tenant → term → enrollment)
 *  3. Validate requested month falls within the selected term's date range
 *  4. Batch-load: periods, class schedules, academic calendar, attendance records
 *  5. Apply Academic Calendar priority override:
 *       Holiday > Exam > Event > ClassSchedule > AttendanceRecord
 *  6. Enforce attendance lock lifecycle: students see SUBMITTED/VERIFIED/LOCKED only
 *  7. Calculate attendance summary using backend formula:
 *       (present + eventLeave + medicalLeave) / totalDelivered × 100
 *  8. Emit async audit log
 *  9. Return DayWiseAttendanceResponse (month-scoped — never semester-wide)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DayWiseAttendanceService {

    private final StudentRepository studentRepository;
    private final AcademicTermRepository academicTermRepository;
    private final StudentEnrollmentRepository enrollmentRepository;
    private final TimetablePeriodRepository timetablePeriodRepository;
    private final ClassScheduleRepository classScheduleRepository;
    private final AcademicCalendarRepository academicCalendarRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final AttendanceAuditService auditService;

    /**
     * Build the complete Day Wise Attendance response for the given student/term/month.
     *
     * @param loginId   Extracted from JWT — never accepted as a request parameter.
     * @param termCode  Academic term (e.g., "2601")
     * @param month     Month number 1–12
     * @param year      Calendar year (e.g., 2026)
     * @param ipAddress Client IP address for audit logging
     */
    @Transactional(readOnly = true)
    public DayWiseAttendanceResponse getDayWiseAttendance(
            String loginId, String termCode, int month, int year, String ipAddress) {

        log.info("Day Wise Attendance request: loginId={}, term={}, month={}, year={}", loginId, termCode, month, year);

        // ── Step 1: Resolve student & tenant context ──────────────────────────
        Student student = studentRepository.findByLoginId(loginId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student profile not found. Please contact administration."));

        String tenantId = student.getTenantId(); // null for legacy data — handled gracefully below

        // ── Step 2: Resolve academic term ────────────────────────────────────
        AcademicTerm term = academicTermRepository.findByTermCode(termCode)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Academic term '" + termCode + "' not found."));

        // ── Step 3: Validate month is within term date range ─────────────────
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate monthStart = yearMonth.atDay(1);
        LocalDate monthEnd = yearMonth.atEndOfMonth();

        if (monthEnd.isBefore(term.getStartDate()) || monthStart.isAfter(term.getEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Month " + month + "/" + year + " is outside the date range of term '" + termCode + "' (" +
                    term.getStartDate() + " to " + term.getEndDate() + ").");
        }

        // Clip date range to term boundaries
        LocalDate rangeStart = monthStart.isBefore(term.getStartDate()) ? term.getStartDate() : monthStart;
        LocalDate rangeEnd = monthEnd.isAfter(term.getEndDate()) ? term.getEndDate() : monthEnd;

        // ── Step 4: Load timetable periods ───────────────────────────────────
        List<TimetablePeriod> periods = timetablePeriodRepository
                .findAllByStatusOrderByPeriodNumberAsc("ACTIVE");

        if (periods.isEmpty()) {
            log.warn("No active timetable periods found. Returning empty grid.");
        }

        // ── Step 5: Load student enrollments ─────────────────────────────────
        List<StudentEnrollment> enrollments = enrollmentRepository
                .findByLoginIdAndTermCodeAndEnrollmentStatus(loginId, termCode, "ACTIVE");

        if (enrollments.isEmpty()) {
            log.warn("No active enrollments for loginId={}, term={}", loginId, termCode);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No active enrollments found for term '" + termCode + "'.");
        }

        List<Long> enrollmentIds = enrollments.stream()
                .map(StudentEnrollment::getId)
                .collect(Collectors.toList());

        // ── Step 6: Load class schedules ─────────────────────────────────────
        // Resolve using tenant-isolated query when tenantId is available;
        // fall back to non-tenant query for legacy/migration data.
        List<ClassSchedule> schedules;
        if (tenantId != null) {
            schedules = classScheduleRepository
                    .findByEnrollmentIdInAndTermCodeAndStatusAndTenantId(enrollmentIds, termCode, "ACTIVE", tenantId);
        } else {
            schedules = classScheduleRepository
                    .findByEnrollmentIdInAndTermCodeAndStatus(enrollmentIds, termCode, "ACTIVE");
        }

        // Build lookup: "MONDAY_<periodId>" → enrollmentId
        // (a student can only have one subject per period per day)
        Map<String, Long> scheduleKey = new HashMap<>();
        for (ClassSchedule cs : schedules) {
            String key = cs.getDayOfWeek() + "_" + cs.getPeriodId();
            scheduleKey.putIfAbsent(key, cs.getEnrollmentId());
        }

        // ── Step 7: Load Academic Calendar events ────────────────────────────
        List<AcademicCalendar> calendarEvents = academicCalendarRepository
                .findByDateRangeAndTerm(rangeStart, rangeEnd, termCode);

        // Build holiday map: date → AcademicCalendar event
        // Priority rule: isHoliday = true overrides all attendance for that date
        Map<LocalDate, AcademicCalendar> holidayMap = new HashMap<>();
        for (AcademicCalendar event : calendarEvents) {
            if (Boolean.TRUE.equals(event.getIsHoliday())) {
                holidayMap.put(event.getEventDate(), event);
            }
        }

        // ── Step 8: Load attendance records (excludes DRAFT) ─────────────────
        List<AttendanceRecord> records = attendanceRecordRepository
                .findVisibleByEnrollmentIdInAndDateRange(
                        enrollmentIds, rangeStart, rangeEnd, AttendanceSessionStatus.DRAFT);

        // Build lookup: "<enrollmentId>_<date>_<periodId>" → AttendanceStatus
        Map<String, AttendanceStatus> attendanceMap = new HashMap<>();
        for (AttendanceRecord record : records) {
            String key = record.getEnrollmentId() + "_" + record.getAttendanceDate() + "_" + record.getPeriodId();
            attendanceMap.put(key, record.getStatus());
        }

        // ── Step 9: Build day-by-day grid ────────────────────────────────────
        List<DayAttendance> calendarDays = new ArrayList<>();
        Map<String, Map<Long, String>> attendanceGrid = new LinkedHashMap<>();

        // Attendance summary counters
        long totalDelivered = 0, presentCount = 0, absentCount = 0, eventLeaveCount = 0, medicalLeaveCount = 0;
        LocalDate today = LocalDate.now();

        for (LocalDate date = rangeStart; !date.isAfter(rangeEnd); date = date.plusDays(1)) {
            String dayOfWeekName = date.getDayOfWeek().name(); // "MONDAY", "TUESDAY", etc.

            // Check Academic Calendar priority
            AcademicCalendar holiday = holidayMap.get(date);

            DayAttendance dayMeta = DayAttendance.builder()
                    .date(date.toString())
                    .dayName(date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH))
                    .dayOfMonth(String.valueOf(date.getDayOfMonth()))
                    .isHoliday(holiday != null)
                    .holidayName(holiday != null ? holiday.getEventName() : null)
                    .calendarEventType(holiday != null ? holiday.getEventType() : null)
                    .build();

            calendarDays.add(dayMeta);

            if (holiday != null) {
                // PRIORITY RULE: Holiday overrides everything.
                // Frontend renders a full-width holiday row for this date.
                attendanceGrid.put(date.toString(), null);
                continue;
            }

            // Build per-period attendance for this day
            Map<Long, String> periodMap = new LinkedHashMap<>();

            for (TimetablePeriod period : periods) {
                String schedKey = dayOfWeekName + "_" + period.getId();
                Long enrollmentId = scheduleKey.get(schedKey);

                if (enrollmentId == null) {
                    // No class scheduled in this slot
                    periodMap.put(period.getId(), AttendanceStatus.NO_CLASS.name());
                } else {
                    String attKey = enrollmentId + "_" + date + "_" + period.getId();
                    AttendanceStatus status = attendanceMap.get(attKey);

                    if (status == null) {
                        // Class is scheduled but no attendance record exists
                        periodMap.put(period.getId(), AttendanceStatus.NOT_MARKED.name());
                    } else {
                        periodMap.put(period.getId(), status.name());

                        // Accumulate summary — only for dates with submitted records
                        if (!date.isAfter(today)) {
                            totalDelivered++;
                            switch (status) {
                                case PRESENT -> presentCount++;
                                case ABSENT  -> absentCount++;
                                case EVENT   -> eventLeaveCount++;
                                case MEDICAL -> medicalLeaveCount++;
                                default      -> { /* HOLIDAY/NO_CLASS/NOT_MARKED excluded from formula */ }
                            }
                        }
                    }
                }
            }

            attendanceGrid.put(date.toString(), periodMap);
        }

        // ── Step 10: Calculate attendance percentage (backend formula) ────────
        double percentage = 0.0;
        if (totalDelivered > 0) {
            percentage = ((presentCount + eventLeaveCount + medicalLeaveCount) * 100.0) / totalDelivered;
            percentage = Math.round(percentage * 100.0) / 100.0;
        }

        AttendanceSummaryResponse summary = AttendanceSummaryResponse.builder()
                .totalDeliveredClasses(totalDelivered)
                .presentCount(presentCount)
                .absentCount(absentCount)
                .eventLeaveCount(eventLeaveCount)
                .medicalLeaveCount(medicalLeaveCount)
                .attendancePercentage(percentage)
                .isEligible(percentage >= 75.0)
                .build();

        // ── Step 11: Build period info list ──────────────────────────────────
        List<PeriodInfo> periodInfos = periods.stream()
                .map(p -> PeriodInfo.builder()
                        .periodId(p.getId())
                        .periodNumber(p.getPeriodNumber())
                        .periodName(p.getPeriodName())
                        .startTime(p.getStartTime().toString())
                        .endTime(p.getEndTime().toString())
                        .build())
                .collect(Collectors.toList());

        // ── Step 12: Determine overall lock status ────────────────────────────
        String overallLockStatus = resolveOverallLockStatus(records);

        // ── Step 13: Emit async audit log (never blocks response) ─────────────
        auditService.logAction(
                tenantId, termCode, loginId,
                AuditActionType.STUDENT_VIEWED, loginId, ipAddress,
                "month=" + month + "&year=" + year);

        // ── Step 14: Build and return response ───────────────────────────────
        return DayWiseAttendanceResponse.builder()
                .student(StudentInfo.builder()
                        .loginId(student.getLoginId())
                        .studentId(student.getStudentId())
                        .fullName(student.getFullName())
                        .department(student.getDepartment())
                        .section(student.getSection())
                        .semester(student.getSemester())
                        .build())
                .term(TermInfo.builder()
                        .termCode(term.getTermCode())
                        .termName(term.getTermName())
                        .year(term.getYear())
                        .startDate(term.getStartDate().toString())
                        .endDate(term.getEndDate().toString())
                        .build())
                .month(MonthInfo.builder()
                        .monthNumber(month)
                        .monthName(yearMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH))
                        .year(year)
                        .totalDays(yearMonth.lengthOfMonth())
                        .build())
                .periods(periodInfos)
                .calendar(calendarDays)
                .attendance(attendanceGrid)
                .summary(summary)
                .lockStatus(overallLockStatus)
                .build();
    }

    /**
     * Determine the weakest (most permissive student-visible) lock status
     * across all attendance records for the month.
     * Order (weakest first): SUBMITTED < VERIFIED < LOCKED
     */
    private String resolveOverallLockStatus(List<AttendanceRecord> records) {
        if (records.isEmpty()) return null;

        Set<AttendanceSessionStatus> statuses = records.stream()
                .map(AttendanceRecord::getLockStatus)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (statuses.isEmpty()) return null;
        if (statuses.contains(AttendanceSessionStatus.SUBMITTED)) return AttendanceSessionStatus.SUBMITTED.name();
        if (statuses.contains(AttendanceSessionStatus.VERIFIED))  return AttendanceSessionStatus.VERIFIED.name();
        return AttendanceSessionStatus.LOCKED.name();
    }
}
