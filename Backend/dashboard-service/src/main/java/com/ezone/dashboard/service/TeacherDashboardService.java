package com.ezone.dashboard.service;

import com.ezone.dashboard.dto.TeacherDashboardSummaryResponse;
import com.ezone.dashboard.dto.TeacherProfileResponse;
import com.ezone.dashboard.entity.Faculty;
import com.ezone.dashboard.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherDashboardService {

    private final FacultyRepository facultyRepository;

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
}
