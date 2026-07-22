package com.ezone.dashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a university student in the CampusSetu ERP.
 *
 * Multi-tenant fields (tenantId, campusId, programId, batchId) enable strict
 * data isolation across university campuses and programs.
 * These fields are nullable to support migration from earlier schema versions.
 */
@Entity
@Table(
    name = "students",
    indexes = {
        @Index(name = "idx_student_login_id", columnList = "login_id"),
        @Index(name = "idx_student_tenant_section", columnList = "tenant_id, section")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login_id", unique = true, nullable = false)
    private String loginId; // Maps to User.loginId from auth-service

    @Column(nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String course;

    private String specialization;

    @Column(nullable = false)
    private String semester;

    @Column(nullable = false)
    private String section;

    @Column(nullable = false, unique = true)
    private String rollNumber;

    private String profilePhoto;

    private Double cgpa;

    @Builder.Default
    private Double attendancePercentage = 0.0;

    @Builder.Default
    private Integer pendingAssignments = 0;

    @Builder.Default
    private Integer completedAssignments = 0;

    @Builder.Default
    private Integer upcomingExams = 0;

    @Column(nullable = false)
    @Builder.Default
    private String status = "Active";

    // ── Multi-tenant fields ────────────────────────────────────────────────────

    /** Tenant identifier — isolates data across institutions in the SaaS platform. */
    @Column(name = "tenant_id")
    private String tenantId;

    /** Campus within the tenant (for multi-campus universities). */
    @Column(name = "campus_id")
    private String campusId;

    /** Academic program (e.g., "BTECH_CSE", "MBA"). */
    @Column(name = "program_id")
    private String programId;

    /** Batch/Cohort year (e.g., "2022", "2024"). */
    @Column(name = "batch_id")
    private String batchId;
}
