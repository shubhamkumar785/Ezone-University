package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherProfileResponse {
    private String facultyName;
    private String facultyId;
    private String department;
    private String designation;
    private String email;
    private String phone;
    private String profilePhoto;
}
