package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Complete Day Wise Attendance API response.
 *
 * Structure:
 *  - student:    Who the attendance belongs to
 *  - term:       Academic term metadata
 *  - month:      Selected month metadata (API is month-scoped, never semester-wide)
 *  - periods:    Timetable period headers (dynamically loaded from DB)
 *  - calendar:   Day-by-day metadata (holiday flags, day names, etc.)
 *  - attendance: Date → PeriodId → AttendanceStatus grid (null entry = holiday/skip)
 *  - summary:    Calculated attendance statistics (backend formula, never frontend)
 *  - lockStatus: Overall lock state for visible attendance records this month
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayWiseAttendanceResponse {

    private StudentInfo student;
    private TermInfo term;
    private MonthInfo month;

    /** Ordered list of active timetable periods for this term/program. */
    private List<PeriodInfo> periods;

    /**
     * Ordered list of calendar days in the selected month range.
     * Days where isHoliday = true → frontend renders a full-width holiday row.
     */
    private List<DayAttendance> calendar;

    /**
     * The attendance grid.
     * Key:   ISO-8601 date string (e.g., "2026-01-06")
     * Value: Map of periodId (Long) → AttendanceStatus name (String)
     *        e.g., {1: "PRESENT", 2: "ABSENT", 3: "NO_CLASS"}
     * Null value for a date = holiday (no period-level data exists).
     *
     * Only SUBMITTED, VERIFIED, LOCKED records are included.
     * DRAFT records are excluded to enforce attendance lock lifecycle.
     */
    private Map<String, Map<Long, String>> attendance;

    /**
     * Month-level attendance summary computed by the backend.
     * Formula: (present + eventLeave + medicalLeave) / totalDeliveredClasses × 100
     */
    private AttendanceSummaryResponse summary;

    /**
     * Overall lock status of attendance records visible in this response.
     * Reflects the weakest (most permissive) lock state across all records.
     * Null if no attendance records exist for the month.
     */
    private String lockStatus;
}
