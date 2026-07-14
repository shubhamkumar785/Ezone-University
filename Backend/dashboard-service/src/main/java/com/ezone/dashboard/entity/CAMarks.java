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
@Table(name = "ca_marks", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"enrollment_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CAMarks {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "enrollment_id", nullable = false, unique = true)
    private Long enrollmentId; // References StudentEnrollment.id
    
    // Theory marks fields (Max: A1=5, AS1=10, A2=5, AS2=5)
    @Column(name = "assignment1")
    private Double assignment1; // A1 - Max 5
    
    @Column(name = "assessment1")
    private Double assessment1; // AS1 - Max 10
    
    @Column(name = "assignment2")
    private Double assignment2; // A2 - Max 5
    
    @Column(name = "assessment2")
    private Double assessment2; // AS2 - Max 5
    
    @Column(name = "last_updated")
    private java.time.LocalDateTime lastUpdated;
    
    @Column(name = "updated_by")
    private String updatedBy; // Teacher's login ID
}
