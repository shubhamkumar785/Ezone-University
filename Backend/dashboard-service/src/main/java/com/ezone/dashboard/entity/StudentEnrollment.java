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
 * Links a student to a subject for a specific academic term.
 * The Day Wise Attendance module resolves timetable and attendance data
 * through these enrollment records — always filtered by tenantId.
 */
@Entity
@Table(
    name = "student_enrollments",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"login_id", "subject_id", "term_code"})
    },
    indexes = {
        @Index(name = "idx_enrollment_login_term", columnList = "login_id, term_code, enrollment_status"),
        @Index(name = "idx_enrollment_tenant", columnList = "tenant_id, term_code")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login_id", nullable = false)
    private String loginId; // Student's loginId

    @Column(name = "subject_id", nullable = false)
    private Long subjectId; // References Subject.id

    @Column(name = "term_code", nullable = false)
    private String termCode; // e.g., "2601", "2602"

    @Column(nullable = false)
    private String semester; // e.g., "6th Semester"

    @Column(nullable = false)
    @Builder.Default
    private String enrollmentStatus = "ACTIVE"; // ACTIVE, DROPPED, COMPLETED

    // ── Multi-tenant fields ────────────────────────────────────────────────────

    /** Tenant isolation key. Inherited from the student record. */
    @Column(name = "tenant_id")
    private String tenantId;

    /**
     * Section identifier for the enrolled student.
     * Used in multi-section queries to avoid cross-section data leaks.
     */
    @Column(name = "section_id")
    private String sectionId;
}
