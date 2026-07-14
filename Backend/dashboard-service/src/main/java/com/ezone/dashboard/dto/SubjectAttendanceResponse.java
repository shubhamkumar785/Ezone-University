package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectAttendanceResponse {
    private Long enrollmentId;
    private String subjectCode;
    private String subjectName;
    private String subjectType; // THEORY or PRACTICAL
    private Integer credits;
    private String facultyName;
    private Long totalClasses;
    private Long attendedClasses;
    private Long absentClasses;
    private Long medicalLeaves;
    private Long eventLeaves;
    private Double attendancePercentage; // null if no attendance recorded
}
