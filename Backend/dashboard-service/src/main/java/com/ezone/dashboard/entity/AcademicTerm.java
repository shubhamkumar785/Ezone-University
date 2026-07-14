package com.ezone.dashboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "academic_terms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicTerm {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String termCode; // e.g., "2601", "2602"
    
    @Column(nullable = false)
    private Integer year; // e.g., 2026
    
    @Column(nullable = false)
    private String termName; // e.g., "Term 1", "Term 2"
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = false; // Current active term
    
    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, UPCOMING
}
