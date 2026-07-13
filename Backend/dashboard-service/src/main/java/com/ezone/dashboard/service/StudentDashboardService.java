package com.ezone.dashboard.service;

import com.ezone.dashboard.dto.DashboardSummaryResponse;
import com.ezone.dashboard.dto.StudentProfileResponse;
import com.ezone.dashboard.entity.Student;
import com.ezone.dashboard.entity.StudentNotification;
import com.ezone.dashboard.repository.StudentNotificationRepository;
import com.ezone.dashboard.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentDashboardService {
    
    private final StudentRepository studentRepository;
    private final StudentNotificationRepository notificationRepository;
    
    @Transactional(readOnly = true)
    public StudentProfileResponse getStudentProfile(String loginId) {
        log.info("Fetching profile for student with loginId: {}", loginId);
        
        Student student = studentRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Student not found with loginId: " + loginId));
        
        return StudentProfileResponse.builder()
                .studentName(student.getFullName())
                .studentId(student.getStudentId())
                .department(student.getDepartment())
                .course(student.getCourse() + (student.getSpecialization() != null ? " - " + student.getSpecialization() : ""))
                .semester(student.getSemester())
                .section(student.getSection())
                .rollNumber(student.getRollNumber())
                .email(student.getEmail())
                .phone(student.getPhone())
                .profilePhoto(student.getProfilePhoto())
                .cgpa(student.getCgpa())
                .build();
    }
    
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary(String loginId) {
        log.info("Fetching dashboard summary for student with loginId: {}", loginId);
        
        Student student = studentRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Student not found with loginId: " + loginId));
        
        List<StudentNotification> notifications = notificationRepository
                .findTop5ByLoginIdOrderByCreatedAtDesc(loginId);
        
        List<DashboardSummaryResponse.NotificationItem> notificationItems = notifications.stream()
                .map(n -> DashboardSummaryResponse.NotificationItem.builder()
                        .id(n.getId())
                        .title(n.getTitle())
                        .message(n.getMessage())
                        .time(formatTimeAgo(n.getCreatedAt()))
                        .type(n.getType())
                        .build())
                .collect(Collectors.toList());
        
        return DashboardSummaryResponse.builder()
                .attendancePercentage(student.getAttendancePercentage())
                .pendingAssignments(student.getPendingAssignments())
                .completedAssignments(student.getCompletedAssignments())
                .upcomingExams(student.getUpcomingExams())
                .latestNotifications(notificationItems)
                .build();
    }
    
    private String formatTimeAgo(LocalDateTime dateTime) {
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        
        long minutes = duration.toMinutes();
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + "m ago";
        
        long hours = duration.toHours();
        if (hours < 24) return hours + "h ago";
        
        long days = duration.toDays();
        if (days < 7) return days + "d ago";
        
        long weeks = days / 7;
        if (weeks < 4) return weeks + "w ago";
        
        long months = days / 30;
        return months + "mo ago";
    }
}
