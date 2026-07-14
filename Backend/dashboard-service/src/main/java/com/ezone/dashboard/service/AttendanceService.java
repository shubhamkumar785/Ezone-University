package com.ezone.dashboard.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ezone.dashboard.dto.StudentAttendanceResponse;
import com.ezone.dashboard.dto.SubjectAttendanceResponse;
import com.ezone.dashboard.entity.AcademicTerm;
import com.ezone.dashboard.entity.Faculty;
import com.ezone.dashboard.entity.Student;
import com.ezone.dashboard.entity.StudentEnrollment;
import com.ezone.dashboard.entity.Subject;
import com.ezone.dashboard.entity.SubjectFacultyMapping;
import com.ezone.dashboard.repository.AcademicTermRepository;
import com.ezone.dashboard.repository.AttendanceRecordRepository;
import com.ezone.dashboard.repository.FacultyRepository;
import com.ezone.dashboard.repository.StudentEnrollmentRepository;
import com.ezone.dashboard.repository.StudentRepository;
import com.ezone.dashboard.repository.SubjectFacultyMappingRepository;
import com.ezone.dashboard.repository.SubjectRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {
    
    private final StudentRepository studentRepository;
    private final AcademicTermRepository academicTermRepository;
    private final StudentEnrollmentRepository enrollmentRepository;
    private final SubjectRepository subjectRepository;
    private final SubjectFacultyMappingRepository subjectFacultyMappingRepository;
    private final FacultyRepository facultyRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    
    @Transactional(readOnly = true)
    public StudentAttendanceResponse getStudentAttendance(String loginId, String termCode) {
        log.info("Fetching attendance for loginId: {} and termCode: {}", loginId, termCode);
        
        return buildStudentAttendanceResponse(loginId, termCode);
    }
    
    @Transactional(readOnly = true)
    public StudentAttendanceResponse exportStudentAttendance(String loginId, String termCode) {
        log.info("Exporting attendance for loginId: {} and termCode: {}", loginId, termCode);
        
        // Same data structure for consistency
        return buildStudentAttendanceResponse(loginId, termCode);
    }
    
    private StudentAttendanceResponse buildStudentAttendanceResponse(String loginId, String termCode) {
        
        // Get student information
        Student student = studentRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Student not found with loginId: " + loginId));
        
        // Get term information
        AcademicTerm term = academicTermRepository.findByTermCode(termCode)
                .orElseThrow(() -> new RuntimeException("Academic term not found: " + termCode));
        
        // Get student enrollments for this term
        List<StudentEnrollment> enrollments = enrollmentRepository
                .findByLoginIdAndTermCodeAndEnrollmentStatus(loginId, termCode, "ACTIVE");
        
        if (enrollments.isEmpty()) {
            log.warn("No active enrollments found for loginId: {} and termCode: {}", loginId, termCode);
            return StudentAttendanceResponse.builder()
                    .termCode(term.getTermCode())
                    .year(term.getYear())
                    .termName(term.getTermName())
                    .studentId(student.getStudentId())
                    .studentName(student.getFullName())
                    .subjects(new ArrayList<>())
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
        
        // Get faculty mappings for these subjects
        List<SubjectFacultyMapping> facultyMappings = subjectFacultyMappingRepository
                .findBySubjectIdInAndTermCodeAndStatus(subjectIds, termCode, "ACTIVE");
        
        Map<Long, SubjectFacultyMapping> facultyMappingMap = facultyMappings.stream()
                .collect(Collectors.toMap(SubjectFacultyMapping::getSubjectId, m -> m, (m1, m2) -> m1));
        
        // Get faculty information
        List<Long> facultyIds = facultyMappings.stream()
                .map(SubjectFacultyMapping::getFacultyId)
                .distinct()
                .collect(Collectors.toList());
        
        Map<Long, Faculty> facultyMap = facultyRepository.findAllById(facultyIds)
                .stream()
                .collect(Collectors.toMap(Faculty::getId, f -> f));
        
        // Build subject attendance list
        List<SubjectAttendanceResponse> subjectAttendanceList = new ArrayList<>();
        
        for (StudentEnrollment enrollment : enrollments) {
            Subject subject = subjectMap.get(enrollment.getSubjectId());
            
            if (subject == null) {
                log.warn("Subject not found for enrollment ID: {}", enrollment.getId());
                continue;
            }
            
            // Get faculty for this subject
            SubjectFacultyMapping facultyMapping = facultyMappingMap.get(subject.getId());
            String facultyName = "Not Assigned";
            if (facultyMapping != null) {
                Faculty faculty = facultyMap.get(facultyMapping.getFacultyId());
                if (faculty != null) {
                    facultyName = faculty.getFullName();
                }
            }
            
            // Get attendance statistics
            Long totalClasses = attendanceRecordRepository.countTotalByEnrollmentId(enrollment.getId());
            Long presentClasses = attendanceRecordRepository.countPresentByEnrollmentId(enrollment.getId());
            Long absentClasses = attendanceRecordRepository.countAbsentByEnrollmentId(enrollment.getId());
            Long medicalLeaves = attendanceRecordRepository.countMedicalByEnrollmentId(enrollment.getId());
            Long eventLeaves = attendanceRecordRepository.countEventByEnrollmentId(enrollment.getId());
            
            // Calculate attendance percentage (null if no classes held)
            Double attendancePercentage = null;
            if (totalClasses != null && totalClasses > 0) {
                attendancePercentage = (presentClasses.doubleValue() / totalClasses.doubleValue()) * 100.0;
                attendancePercentage = Math.round(attendancePercentage * 100.0) / 100.0; // Round to 2 decimal places
            }
            
            subjectAttendanceList.add(SubjectAttendanceResponse.builder()
                    .enrollmentId(enrollment.getId())
                    .subjectCode(subject.getSubjectCode())
                    .subjectName(subject.getSubjectName())
                    .subjectType(subject.getType())
                    .credits(subject.getCredits())
                    .facultyName(facultyName)
                    .totalClasses(totalClasses != null ? totalClasses : 0L)
                    .attendedClasses(presentClasses != null ? presentClasses : 0L)
                    .absentClasses(absentClasses != null ? absentClasses : 0L)
                    .medicalLeaves(medicalLeaves != null ? medicalLeaves : 0L)
                    .eventLeaves(eventLeaves != null ? eventLeaves : 0L)
                    .attendancePercentage(attendancePercentage)
                    .build());
        }
        
        return StudentAttendanceResponse.builder()
                .termCode(term.getTermCode())
                .year(term.getYear())
                .termName(term.getTermName())
                .studentId(student.getStudentId())
                .studentName(student.getFullName())
                .subjects(subjectAttendanceList)
                .build();
    }
}
