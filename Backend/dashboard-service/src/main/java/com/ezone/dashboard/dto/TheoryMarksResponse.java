package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheoryMarksResponse {
    private String subjectCode;
    private String subjectName;
    private Double assignment1; // A1
    private Double assessment1; // AS1
    private Double assignment2; // A2
    private Double assessment2; // AS2
    private Double total;
}
