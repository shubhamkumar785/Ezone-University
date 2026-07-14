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
public class CAMarksResponse {
    private String termCode;
    private Integer year;
    private String termName;
    private List<TheoryMarksResponse> theoryMarks;
    private List<PracticalMarksResponse> practicalMarks;
}
