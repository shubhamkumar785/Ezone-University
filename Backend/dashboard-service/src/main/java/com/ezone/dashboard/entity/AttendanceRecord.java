package com.ezone.dashboard.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Records a single attendance event for a student in a specific class period on a specific date.
 *
 * Multi-tenant: every record carries tenantId for strict data isolation.
 * Lock lifecycle: DRAFT (hidden from students) → SUBMITTED → VERIFIED → LOCKED.
 *
 * Composite index on (tenant_id, enrollment_id, attendance_date) for efficient
 * month-range queries used by the Day Wise Attendance API.
 */
@Entity
@Table(
    name = "attendance_records",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"enrollment_id", "attendance_date", "period_id"})
    },
    indexes = {
        @Index(name = "idx_ar_tenant_enrollment_date", columnList = "tenant_id, enrollment_id, attendance_date"),
        @Index(name = "idx_ar_enrollment_date", columnList = "enrollment_id, attendance_date"),
        @Index(name = "idx_ar_lock_status", columnList = "lock_status")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Multi-tenant isolation key. Never fetch without this in production queries. */
    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "enrollment_id", nullable = false)
    private Long enrollmentId; // References StudentEnrollment.id

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "period_id")
    private Long periodId; // References TimetablePeriod.id

    /**
     * Attendance status using the AttendanceStatus enum.
     * Stored as STRING in the database for readability and forward compatibility.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;

    /**
     * Lock lifecycle state.
     * Students only see records with lockStatus IN (SUBMITTED, VERIFIED, LOCKED).
     * DRAFT records are exclusively visible to the submitting teacher.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "lock_status")
    @Builder.Default
    private AttendanceSessionStatus lockStatus = AttendanceSessionStatus.DRAFT;

    private String remarks;

    @Column(name = "marked_by")
    private String markedBy; // Faculty's loginId

    @Column(name = "marked_at")
    private LocalDateTime markedAt;

    @Column(name = "locked_by")
    private String lockedBy; // Admin's loginId who locked the record

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;
}
