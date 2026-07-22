package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Student identity block included in every Day Wise Attendance response. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentInfo {
    private String loginId;
    private String studentId;
    private String fullName;
    private String department;
    private String section;
    private String semester;
}
