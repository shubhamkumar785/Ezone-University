package com.ezone.dashboard.controller;

import com.ezone.dashboard.dto.TeacherDashboardSummaryResponse;
import com.ezone.dashboard.dto.TeacherProfileResponse;
import com.ezone.dashboard.service.TeacherDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import com.ezone.dashboard.dto.StudentListDto;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teacher/dashboard")
@RequiredArgsConstructor
public class TeacherDashboardController {

    private final TeacherDashboardService teacherDashboardService;

    @GetMapping("/profile")
    public ResponseEntity<TeacherProfileResponse> getTeacherProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginId = authentication.getName();
        return ResponseEntity.ok(teacherDashboardService.getTeacherProfile(loginId));
    }

    @GetMapping("/summary")
    public ResponseEntity<TeacherDashboardSummaryResponse> getDashboardSummary() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginId = authentication.getName();
        return ResponseEntity.ok(teacherDashboardService.getDashboardSummary(loginId));
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentListDto>> getStudentsBySection(@RequestParam String section) {
        return ResponseEntity.ok(teacherDashboardService.getStudentsBySection(section));
    }
}
