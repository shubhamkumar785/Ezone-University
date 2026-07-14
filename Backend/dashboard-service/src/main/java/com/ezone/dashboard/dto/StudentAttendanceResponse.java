package com.ezone.dashboard.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAttendanceResponse {
    private String termCode;
    private Integer year;
    private String termName;
    private String studentId;
    private String studentName;
    private List<SubjectAttendanceResponse> subjects;
}
