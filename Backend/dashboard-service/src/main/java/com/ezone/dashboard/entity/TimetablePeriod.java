package com.ezone.dashboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

/**
 * Defines a numbered class period with its start/end time.
 * Managed by the Admin Dashboard — not seeded for production.
 *
 * Multi-tenant: tenantId, programId, sectionId allow different programs/sections
 * to have different timetable structures within the same tenant.
 */
@Entity
@Table(
    name = "timetable_periods",
    indexes = {
        @Index(name = "idx_tp_tenant_program", columnList = "tenant_id, program_id, status"),
        @Index(name = "idx_tp_status_order", columnList = "status, period_number")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetablePeriod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer periodNumber; // 1, 2, 3, etc.

    @Column(nullable = false)
    private String periodName; // "Period 1", "Period 2", etc.

    @Column(nullable = false)
    private LocalTime startTime; // e.g., 09:00:00

    @Column(nullable = false)
    private LocalTime endTime; // e.g., 09:50:00

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, INACTIVE

    // ── Multi-tenant fields ────────────────────────────────────────────────────

    /** Tenant isolation key. */
    @Column(name = "tenant_id")
    private String tenantId;

    /** Academic program this period structure belongs to. */
    @Column(name = "program_id")
    private String programId;

    /** Section — some sections may have different period structures. */
    @Column(name = "section_id")
    private String sectionId;
}
