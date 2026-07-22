package com.ezone.dashboard.entity;

import java.time.LocalDate;

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
 * Represents a university academic calendar event — holidays, exam periods,
 * festival breaks, semester breaks, and university events.
 *
 * Priority rule: isHoliday = true overrides all attendance records for that date.
 * Managed by the Admin Dashboard. Never seeded for production.
 *
 * Multi-tenant: tenantId + campusId allow campus-specific holidays
 * (e.g., local festivals) alongside institution-wide holidays.
 */
@Entity
@Table(
    name = "academic_calendar",
    indexes = {
        @Index(name = "idx_ac_tenant_date", columnList = "tenant_id, event_date"),
        @Index(name = "idx_ac_term_date", columnList = "term_code, event_date"),
        @Index(name = "idx_ac_holiday", columnList = "is_holiday, event_date")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    /**
     * Event classification.
     * Values: HOLIDAY, SEMESTER_BREAK, EXAM, FESTIVAL, UNIVERSITY_EVENT
     */
    @Column(nullable = false)
    private String eventType;

    @Column(nullable = false)
    private String eventName; // e.g., "Republic Day", "Mid-Term Exam", "Diwali"

    private String description;

    @Column(name = "term_code")
    private String termCode; // null = applies to all terms in the tenant

    /**
     * When true, classes are cancelled for this day.
     * Holiday priority overrides all attendance records — students never see
     * P/A/ML/EL on a holiday date.
     */
    @Column(name = "is_holiday", nullable = false)
    @Builder.Default
    private Boolean isHoliday = false;

    // ── Multi-tenant fields ────────────────────────────────────────────────────

    /** Tenant isolation key. */
    @Column(name = "tenant_id")
    private String tenantId;

    /** Campus-specific holiday (null = applies to all campuses in the tenant). */
    @Column(name = "campus_id")
    private String campusId;
}
