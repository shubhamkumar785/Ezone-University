package com.ezone.dashboard.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingLeaveDto {
    private Long id;
    private String employee;
    private String department;
    private String leaveType;
    private String status;
    private String initials;
    private String time;
    private String duration;
}
