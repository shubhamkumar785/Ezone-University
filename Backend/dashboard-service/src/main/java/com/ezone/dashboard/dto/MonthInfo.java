package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Selected month metadata block in the Day Wise Attendance response. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthInfo {
    private Integer monthNumber; // 1-12
    private String monthName;    // "January", "February", etc.
    private Integer year;        // e.g., 2026
    private Integer totalDays;   // 28, 29, 30, or 31
}
