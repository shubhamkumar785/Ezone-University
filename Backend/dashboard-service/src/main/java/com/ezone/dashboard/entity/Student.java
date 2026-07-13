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
@Table(name = "students")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String loginId; // Maps to User.loginId from auth-service
    
    @Column(nullable = false)
    private String studentId;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String email;
    
    private String phone;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    private String course;
    
    private String specialization;
    
    @Column(nullable = false)
    private String semester;
    
    @Column(nullable = false)
    private String section;
    
    @Column(nullable = false, unique = true)
    private String rollNumber;
    
    private String profilePhoto;
    
    private Double cgpa;
    
    @Builder.Default
    private Double attendancePercentage = 0.0;
    
    @Builder.Default
    private Integer pendingAssignments = 0;
    
    @Builder.Default
    private Integer completedAssignments = 0;
    
    @Builder.Default
    private Integer upcomingExams = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private String status = "Active";
}
