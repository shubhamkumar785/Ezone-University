package com.ezone.dashboard.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAlertDto {
    private Long id;
    private String title;
    private String message;
    private String severity;
    private String timestamp;
}
