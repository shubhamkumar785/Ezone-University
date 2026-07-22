package com.ezone.dashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Audit log for every meaningful attendance-related action.
 * Written asynchronously so it never blocks the student's API response.
 *
 * Indexed on (tenant_id, term_code, student_login_id) for compliance queries.
 */
@Entity
@Table(
    name = "attendance_audit_logs",
    indexes = {
        @Index(name = "idx_audit_tenant_term", columnList = "tenant_id, term_code"),
        @Index(name = "idx_audit_student", columnList = "student_login_id"),
        @Index(name = "idx_audit_created_at", columnList = "created_at")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "term_code")
    private String termCode;

    @Column(name = "student_login_id")
    private String studentLoginId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private AuditActionType actionType;

    @Column(name = "action_date")
    private String actionDate; // e.g. "month=1&year=2026"

    @Column(name = "performed_by")
    private String performedBy; // loginId of the actor

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details; // JSON string of additional context

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
