package com.ezone.dashboard.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentActivityDto {
    private Long id;
    private String time;
    private String module;
    private String message;
    private String statusColor;
}
