package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeriodInfo {
    private Long periodId;
    private Integer periodNumber;
    private String periodName;
    private String startTime; // "09:00:00"
    private String endTime; // "09:50:00"
}
