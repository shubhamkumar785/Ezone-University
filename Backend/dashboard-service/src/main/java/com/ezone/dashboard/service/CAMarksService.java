package com.ezone.dashboard.service;

import com.ezone.dashboard.dto.AcademicTermResponse;
import com.ezone.dashboard.dto.CAMarksResponse;
import com.ezone.dashboard.dto.PracticalMarksResponse;
import com.ezone.dashboard.dto.TheoryMarksResponse;
import com.ezone.dashboard.entity.*;
import com.ezone.dashboard.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CAMarksService {
    
    private final AcademicTermRepository academicTermRepository;
    private final StudentEnrollmentRepository enrollmentRepository;
    private final SubjectRepository subjectRepository;
    private final CAMarksRepository caMarksRepository;
    private final PracticalMarksRepository practicalMarksRepository;
    
    @Transactional(readOnly = true)
    public AcademicTermResponse getActiveTerm() {
        log.info("Fetching active academic term");
        
        AcademicTerm activeTerm = academicTermRepository.findByIsActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active academic term found"));
        
        return AcademicTermResponse.builder()
                .termCode(activeTerm.getTermCode())
                .year(activeTerm.getYear())
                .termName(activeTerm.getTermName())
                .isActive(activeTerm.getIsActive())
                .status(activeTerm.getStatus())
                .build();
    }
    
    @Transactional(readOnly = true)
    public List<AcademicTermResponse> getAllTerms() {
        log.info("Fetching all academic terms");
        
        List<AcademicTerm> terms = academicTermRepository.findAllByOrderByYearDescTermCodeDesc();
        
        return terms.stream()
                .map(term -> AcademicTermResponse.builder()
                        .termCode(term.getTermCode())
                        .year(term.getYear())
                        .termName(term.getTermName())
                        .isActive(term.getIsActive())
                        .status(term.getStatus())
                        .build())
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public CAMarksResponse getCAMarks(String loginId, String termCode) {
        log.info("Fetching CA marks for loginId: {} and termCode: {}", loginId, termCode);
        
        // Get term information
        AcademicTerm term = academicTermRepository.findByTermCode(termCode)
                .orElseThrow(() -> new RuntimeException("Academic term not found: " + termCode));
        
        // Get student enrollments for this term
        List<StudentEnrollment> enrollments = enrollmentRepository
                .findByLoginIdAndTermCodeAndEnrollmentStatus(loginId, termCode, "ACTIVE");
        
        if (enrollments.isEmpty()) {
            log.warn("No active enrollments found for loginId: {} and termCode: {}", loginId, termCode);
            return CAMarksResponse.builder()
                    .termCode(term.getTermCode())
                    .year(term.getYear())
                    .termName(term.getTermName())
                    .theoryMarks(new ArrayList<>())
                    .practicalMarks(new ArrayList<>())
                    .build();
        }
        
        // Get all subject IDs
        List<Long> subjectIds = enrollments.stream()
                .map(StudentEnrollment::getSubjectId)
                .collect(Collectors.toList());
        
        // Get all subjects
        Map<Long, Subject> subjectMap = subjectRepository.findAllById(subjectIds)
                .stream()
                .collect(Collectors.toMap(Subject::getId, s -> s));
        
        // Get enrollment IDs
        List<Long> enrollmentIds = enrollments.stream()
                .map(StudentEnrollment::getId)
                .collect(Collectors.toList());
        
        // Get all CA marks
        Map<Long, CAMarks> caMarksMap = caMarksRepository.findByEnrollmentIdIn(enrollmentIds)
                .stream()
                .collect(Collectors.toMap(CAMarks::getEnrollmentId, m -> m));
        
        // Get all practical marks
        Map<Long, PracticalMarks> practicalMarksMap = practicalMarksRepository.findByEnrollmentIdIn(enrollmentIds)
                .stream()
                .collect(Collectors.toMap(PracticalMarks::getEnrollmentId, m -> m));
        
        // Build theory marks list
        List<TheoryMarksResponse> theoryMarksList = new ArrayList<>();
        
        // Build practical marks list
        List<PracticalMarksResponse> practicalMarksList = new ArrayList<>();
        
        for (StudentEnrollment enrollment : enrollments) {
            Subject subject = subjectMap.get(enrollment.getSubjectId());
            
            if (subject == null) {
                log.warn("Subject not found for enrollment ID: {}", enrollment.getId());
                continue;
            }
            
            if ("THEORY".equals(subject.getType())) {
                CAMarks caMarks = caMarksMap.get(enrollment.getId());
                
                Double a1 = caMarks != null ? caMarks.getAssignment1() : null;
                Double as1 = caMarks != null ? caMarks.getAssessment1() : null;
                Double a2 = caMarks != null ? caMarks.getAssignment2() : null;
                Double as2 = caMarks != null ? caMarks.getAssessment2() : null;
                
                // Calculate total only if all marks are present
                Double total = null;
                if (a1 != null && as1 != null && a2 != null && as2 != null) {
                    total = a1 + as1 + a2 + as2;
                }
                
                theoryMarksList.add(TheoryMarksResponse.builder()
                        .subjectCode(subject.getSubjectCode())
                        .subjectName(subject.getSubjectName())
                        .assignment1(a1)
                        .assessment1(as1)
                        .assignment2(a2)
                        .assessment2(as2)
                        .total(total)
                        .build());
                
            } else if ("PRACTICAL".equals(subject.getType())) {
                PracticalMarks practicalMarks = practicalMarksMap.get(enrollment.getId());
                
                Double caAi = practicalMarks != null ? practicalMarks.getCaAi() : null;
                Double caNaal = practicalMarks != null ? practicalMarks.getCaNaal() : null;
                Double caJury = practicalMarks != null ? practicalMarks.getCaJury() : null;
                Double contAssessment = practicalMarks != null ? practicalMarks.getContinuousAssessment() : null;
                Double contEvaluation = practicalMarks != null ? practicalMarks.getContinuousEvaluation() : null;
                
                // Calculate total only if at least one mark is present
                Double total = null;
                if (caAi != null || caNaal != null || caJury != null || contAssessment != null || contEvaluation != null) {
                    total = 0.0;
                    if (caAi != null) total += caAi;
                    if (caNaal != null) total += caNaal;
                    if (caJury != null) total += caJury;
                    if (contAssessment != null) total += contAssessment;
                    if (contEvaluation != null) total += contEvaluation;
                }
                
                practicalMarksList.add(PracticalMarksResponse.builder()
                        .subjectCode(subject.getSubjectCode())
                        .subjectName(subject.getSubjectName())
                        .caAi(caAi)
                        .caNaal(caNaal)
                        .caJury(caJury)
                        .continuousAssessment(contAssessment)
                        .continuousEvaluation(contEvaluation)
                        .total(total)
                        .build());
            }
        }
        
        return CAMarksResponse.builder()
                .termCode(term.getTermCode())
                .year(term.getYear())
                .termName(term.getTermName())
                .theoryMarks(theoryMarksList)
                .practicalMarks(practicalMarksList)
                .build();
    }
}
