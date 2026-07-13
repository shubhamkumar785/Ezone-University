package com.ezone.dashboard.entity;

import java.time.LocalDateTime;

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
@Table(name = "student_notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentNotification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String loginId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 500)
    private String message;
    
    @Column(nullable = false)
    private String type; // INFO, WARNING, SUCCESS, ERROR
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Builder.Default
    private Boolean isRead = false;
}
