package com.ezone.dashboard.controller;

import com.ezone.dashboard.entity.Faculty;
import com.ezone.dashboard.service.AdminTeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/teachers")
@RequiredArgsConstructor
public class AdminTeacherController {

    private final AdminTeacherService adminTeacherService;

    @GetMapping("/next-id")
    public ResponseEntity<Map<String, String>> getNextTeacherId() {
        return ResponseEntity.ok(Map.of("nextId", adminTeacherService.generateNextTeacherId()));
    }

    @GetMapping
    public ResponseEntity<List<Faculty>> getAllTeachers() {
        return ResponseEntity.ok(adminTeacherService.getAllTeachers());
    }

    @PostMapping
    public ResponseEntity<Faculty> addTeacher(@RequestBody Faculty teacher) {
        return ResponseEntity.ok(adminTeacherService.addTeacher(teacher));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Faculty> updateTeacher(@PathVariable Long id, @RequestBody Faculty teacher) {
        return ResponseEntity.ok(adminTeacherService.updateTeacher(id, teacher));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Faculty> deactivateTeacher(@PathVariable Long id) {
        return ResponseEntity.ok(adminTeacherService.deactivateTeacher(id));
    }
}
