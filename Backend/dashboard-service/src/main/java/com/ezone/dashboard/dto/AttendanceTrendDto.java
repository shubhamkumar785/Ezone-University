package com.ezone.dashboard.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceTrendDto {
    private String month;
    private Integer present;
    private Integer absent;
}
