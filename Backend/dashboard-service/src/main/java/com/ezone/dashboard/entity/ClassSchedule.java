package com.ezone.dashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
 * Defines which timetable period a student's enrollment has a class on a given day of the week.
 * The Day Wise Attendance service joins class schedules with attendance records to determine
 * per-period status (PRESENT, ABSENT, NO_CLASS, NOT_MARKED, etc.).
 *
 * Multi-tenant: tenantId ensures schedules from one institution never bleed into another.
 */
@Entity
@Table(
    name = "class_schedules",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"enrollment_id", "day_of_week", "period_id", "term_code"})
    },
    indexes = {
        @Index(name = "idx_cs_enrollment_term", columnList = "enrollment_id, term_code, status"),
        @Index(name = "idx_cs_tenant_term", columnList = "tenant_id, term_code")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "enrollment_id", nullable = false)
    private Long enrollmentId; // References StudentEnrollment.id

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek; // MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY

    @Column(name = "period_id", nullable = false)
    private Long periodId; // References TimetablePeriod.id

    @Column(name = "term_code", nullable = false)
    private String termCode; // e.g., "2601"

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, CANCELLED

    // ── Multi-tenant field ─────────────────────────────────────────────────────

    /** Tenant isolation key. */
    @Column(name = "tenant_id")
    private String tenantId;
}
