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
@Table(name = "practical_marks", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"enrollment_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PracticalMarks {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "enrollment_id", nullable = false, unique = true)
    private Long enrollmentId; // References StudentEnrollment.id
    
    // Practical marks fields
    @Column(name = "ca_ai")
    private Double caAi; // CA AI - Max 75
    
    @Column(name = "ca_naal")
    private Double caNaal; // CA NAAL - Max 100
    
    @Column(name = "ca_jury")
    private Double caJury; // CA Jury - Max 50
    
    @Column(name = "continuous_assessment")
    private Double continuousAssessment; // Max 30
    
    @Column(name = "continuous_evaluation")
    private Double continuousEvaluation; // Max 30
    
    @Column(name = "last_updated")
    private java.time.LocalDateTime lastUpdated;
    
    @Column(name = "updated_by")
    private String updatedBy; // Teacher's login ID
}
