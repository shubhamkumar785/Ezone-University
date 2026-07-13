package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {
    private String studentName;
    private String studentId;
    private String department;
    private String course;
    private String semester;
    private String section;
    private String rollNumber;
    private String email;
    private String phone;
    private String profilePhoto;
    private Double cgpa;
}
