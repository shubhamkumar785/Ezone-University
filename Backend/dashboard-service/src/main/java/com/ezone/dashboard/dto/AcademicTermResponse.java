package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicTermResponse {
    private String termCode;
    private Integer year;
    private String termName;
    private Boolean isActive;
    private String status;
}
