package com.ezone.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PracticalMarksResponse {
    private String subjectCode;
    private String subjectName;
    private Double caAi;
    private Double caNaal;
    private Double caJury;
    private Double continuousAssessment;
    private Double continuousEvaluation;
    private Double total;
}
