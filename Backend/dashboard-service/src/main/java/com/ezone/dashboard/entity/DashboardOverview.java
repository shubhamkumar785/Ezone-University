package com.ezone.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dashboard_overview")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardOverview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_students", nullable = false)
    private Integer totalStudents;

    @Column(name = "total_teachers", nullable = false)
    private Integer totalTeachers;

    @Column(name = "total_departments", nullable = false)
    private Integer totalDepartments;

    @Column(name = "active_courses", nullable = false)
    private Integer activeCourses;

    @Column(name = "average_attendance", nullable = false)
    private Double averageAttendance;

    @Column(name = "pending_leaves", nullable = false)
    private Integer pendingLeaves;

    @Column(name = "active_alerts", nullable = false)
    private Integer activeAlerts;

    @Column(name = "fee_collected", nullable = false)
    private Double feeCollected;
}
