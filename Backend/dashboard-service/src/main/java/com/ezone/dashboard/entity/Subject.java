package com.ezone.dashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subjects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String subjectCode; // e.g., "CSE3521", "CSA474"
    
    @Column(nullable = false)
    private String subjectName; // e.g., "Software Testing", "Artificial Intelligence"
    
    @Column(nullable = false)
    private String type; // "THEORY" or "PRACTICAL"
    
    @Column(nullable = false)
    private String department; // e.g., "Computer Science"
    
    @Column(nullable = false)
    private Integer credits;
    
    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, INACTIVE
}
