package com.ezone.dashboard.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeReportDto {
    private String month;
    private Long collected;
    private Long target;
}
