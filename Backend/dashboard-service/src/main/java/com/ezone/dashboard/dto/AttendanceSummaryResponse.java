package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Attendance summary for the selected student/term/month combination.
 *
 * Formula (computed on backend — never on frontend):
 *   Attendance % = (present + eventLeave + medicalLeave) / totalDeliveredClasses × 100
 *
 * totalDeliveredClasses excludes: holidays, future dates (NOT_MARKED), NO_CLASS slots.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryResponse {

    /** Total class-period slots where attendance was marked (not NM/NCS/Holiday). */
    private Long totalDeliveredClasses;

    private Long presentCount;
    private Long absentCount;
    private Long eventLeaveCount;
    private Long medicalLeaveCount;

    /** Percentage rounded to 2 decimal places. 0.0 if no classes delivered. */
    private Double attendancePercentage;

    /** True if attendancePercentage >= 75.0. */
    private Boolean isEligible;
}
