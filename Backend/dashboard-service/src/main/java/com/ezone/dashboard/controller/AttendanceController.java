package com.ezone.dashboard.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ezone.dashboard.dto.DayWiseAttendanceResponse;
import com.ezone.dashboard.dto.StudentAttendanceResponse;
import com.ezone.dashboard.service.AttendanceService;
import com.ezone.dashboard.service.DayWiseAttendanceService;
import com.ezone.dashboard.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/student/attendance")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final DayWiseAttendanceService dayWiseAttendanceService;
    private final JwtUtil jwtUtil;

    // ── Subject-level attendance (existing) ──────────────────────────────────

    @GetMapping("/{termCode}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentAttendanceResponse> getAttendance(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String termCode) {

        String loginId = extractLoginId(authHeader);
        log.info("Attendance request: loginId={}, termCode={}", loginId, termCode);

        StudentAttendanceResponse attendance = attendanceService.getStudentAttendance(loginId, termCode);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/{termCode}/export")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentAttendanceResponse> exportAttendance(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String termCode) {

        String loginId = extractLoginId(authHeader);
        log.info("Attendance export request: loginId={}, termCode={}", loginId, termCode);

        StudentAttendanceResponse attendance = attendanceService.exportStudentAttendance(loginId, termCode);
        return ResponseEntity.ok(attendance);
    }

    // ── Day Wise Attendance ───────────────────────────────────────────────────

    /**
     * GET /api/student/attendance/{termCode}/day-wise?month=1&year=2026
     *
     * Returns the complete day-wise attendance grid for the selected student/term/month.
     * Month-scoped only — never returns semester-wide data.
     *
     * Security:
     *   - Requires valid JWT with role = STUDENT.
     *   - loginId is extracted from the JWT — never accepted as a request parameter.
     *   - Students can only access their own attendance data.
     *
     * Defaults:
     *   - month: current calendar month
     *   - year:  current calendar year
     *
     * Validation:
     *   - month/year must fall within the selected term's date range → 400 Bad Request
     *   - Student must have active enrollments in the term → 404 Not Found
     */
    @GetMapping("/{termCode}/day-wise")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DayWiseAttendanceResponse> getDayWiseAttendance(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String termCode,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            HttpServletRequest request) {

        String loginId = extractLoginId(authHeader);

        // Default to current month/year if not provided
        LocalDate now = LocalDate.now();
        int resolvedMonth = (month != null) ? month : now.getMonthValue();
        int resolvedYear  = (year  != null) ? year  : now.getYear();

        log.info("Day Wise Attendance request: loginId={}, term={}, month={}, year={}",
                loginId, termCode, resolvedMonth, resolvedYear);

        String ipAddress = extractClientIp(request);

        DayWiseAttendanceResponse response = dayWiseAttendanceService
                .getDayWiseAttendance(loginId, termCode, resolvedMonth, resolvedYear, ipAddress);

        return ResponseEntity.ok(response);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Extract loginId from the JWT Bearer token.
     * loginId is ALWAYS sourced from the verified JWT — never from request parameters.
     */
    private String extractLoginId(String authHeader) {
        String token = authHeader.substring(7);
        return jwtUtil.extractLoginId(token);
    }

    /** Resolve client IP, accounting for reverse proxies. */
    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
