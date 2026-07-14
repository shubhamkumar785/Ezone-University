package com.ezone.dashboard.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
@Table(name = "attendance_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"enrollment_id", "attendance_date"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "enrollment_id", nullable = false)
    private Long enrollmentId; // References StudentEnrollment.id
    
    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;
    
    @Column(nullable = false)
    private String status; // PRESENT, ABSENT, MEDICAL, EVENT
    
    private String remarks;
    
    @Column(name = "marked_by")
    private String markedBy; // Faculty's login ID
    
    @Column(name = "marked_at")
    private LocalDateTime markedAt;
}
