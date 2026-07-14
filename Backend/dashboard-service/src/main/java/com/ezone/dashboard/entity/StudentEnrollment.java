package com.ezone.dashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student_enrollments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"login_id", "subject_id", "term_code"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentEnrollment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "login_id", nullable = false)
    private String loginId; // Student's login ID
    
    @Column(name = "subject_id", nullable = false)
    private Long subjectId; // References Subject.id
    
    @Column(name = "term_code", nullable = false)
    private String termCode; // e.g., "2601", "2602"
    
    @Column(nullable = false)
    private String semester; // e.g., "6th Semester"
    
    @Column(nullable = false)
    @Builder.Default
    private String enrollmentStatus = "ACTIVE"; // ACTIVE, DROPPED, COMPLETED
}
