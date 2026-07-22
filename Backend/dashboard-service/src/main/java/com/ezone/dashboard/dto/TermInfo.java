package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Academic term metadata block in the Day Wise Attendance response. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TermInfo {
    private String termCode;
    private String termName;
    private Integer year;
    private String startDate; // ISO-8601: "2026-01-01"
    private String endDate;   // ISO-8601: "2026-06-30"
}
