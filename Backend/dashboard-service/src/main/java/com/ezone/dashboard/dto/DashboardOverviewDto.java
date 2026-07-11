package com.ezone.dashboard.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardOverviewDto {
    private Integer totalStudents;
    private Integer totalTeachers;
    private Integer totalDepartments;
    private Integer activeCourses;
    private Double averageAttendance;
    private Integer pendingLeaves;
    private Integer activeAlerts;
    private Long feeCollected;
}
