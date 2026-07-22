package com.ezone.dashboard.service;

import com.ezone.dashboard.dto.TeacherDashboardSummaryResponse;
import com.ezone.dashboard.dto.TeacherProfileResponse;
import com.ezone.dashboard.dto.StudentListDto;
import java.util.List;
import com.ezone.dashboard.entity.Faculty;
import com.ezone.dashboard.repository.FacultyRepository;
import com.ezone.dashboard.repository.StudentRepository;
import com.ezone.dashboard.entity.Student;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherDashboardService {

    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;

    public TeacherProfileResponse getTeacherProfile(String loginId) {
        log.info("Fetching profile for teacher with loginId: {}", loginId);

        // We assume loginId corresponds to facultyId
        Faculty faculty = facultyRepository.findByFacultyId(loginId)
                .orElseGet(() -> {
                    // Fallback mock logic if DB doesn't have it (so UI doesn't break in dev)
                    return Faculty.builder()
                            .facultyId(loginId)
                            .fullName("Mock Teacher")
                            .department("Computer Science")
                            .designation("Assistant Professor")
                            .email(loginId + "@ezone.edu")
                            .phone("9876543210")
                            .build();
                });

        return TeacherProfileResponse.builder()
                .facultyName(faculty.getFullName())
                .facultyId(faculty.getFacultyId())
                .department(faculty.getDepartment())
                .designation(faculty.getDesignation())
                .email(faculty.getEmail())
                .phone(faculty.getPhone())
                .profilePhoto(null) // Not in DB yet
                .build();
    }

    public TeacherDashboardSummaryResponse getDashboardSummary(String loginId) {
        log.info("Fetching dashboard summary for teacher with loginId: {}", loginId);

        // Generate some mock stats
        int daysPresent = 22;
        int totalWorkingDays = 25;
        int leavesTaken = 3;
        double attendancePercentage = ((double) daysPresent / totalWorkingDays) * 100;

        return TeacherDashboardSummaryResponse.builder()
                .unreadNotifications(new ArrayList<>())
                .notificationCount(0)
                .totalClassesAssigned(4)
                .totalStudentsMentored(12)
                .pendingAssignmentsToGrade(3)
                .facultyAttendancePercentage(attendancePercentage)
                .daysPresent(daysPresent)
                .totalWorkingDays(totalWorkingDays)
                .leavesTaken(leavesTaken)
                .nextClass("Data Structures - CSE-B")
                .nextClassTime("10:00 AM")
                .build();
    }

    public List<StudentListDto> getStudentsBySection(String section) {
        log.info("Fetching students for section: {}", section);
        List<Student> students = studentRepository.findBySection(section);
        return students.stream()
                .map(student -> StudentListDto.builder()
                        .id(student.getId())
                        .rollNo(student.getRollNumber())
                        .name(student.getFullName())
                        .status("absent") // Default status as requested
                        .build())
                .collect(Collectors.toList());
    }
}
