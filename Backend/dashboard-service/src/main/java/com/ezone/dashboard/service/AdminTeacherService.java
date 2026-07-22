package com.ezone.dashboard.service;

import com.ezone.dashboard.entity.Faculty;
import com.ezone.dashboard.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminTeacherService {

    private final FacultyRepository facultyRepository;

    public String generateNextTeacherId() {
        String maxId = facultyRepository.findMaxFacultyId();
        if (maxId == null || !maxId.startsWith("TCH")) {
            return "TCH001";
        }
        
        try {
            int currentNum = Integer.parseInt(maxId.substring(3));
            return String.format("TCH%03d", currentNum + 1);
        } catch (NumberFormatException e) {
            log.error("Error parsing max teacher ID: {}", maxId, e);
            return "TCH001";
        }
    }

    public List<Faculty> getAllTeachers() {
        return facultyRepository.findAll();
    }

    @Transactional
    public Faculty addTeacher(Faculty teacher) {
        // Ensure ID is generated if not provided, or strictly regenerate
        String nextId = generateNextTeacherId();
        teacher.setFacultyId(nextId);
        
        if (teacher.getStatus() == null) {
            teacher.setStatus("Active");
        }
        
        return facultyRepository.save(teacher);
    }

    @Transactional
    public Faculty updateTeacher(Long id, Faculty updated) {
        Faculty existing = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));
        
        existing.setFullName(updated.getFullName());
        existing.setEmail(updated.getEmail());
        existing.setDepartment(updated.getDepartment());
        existing.setQualification(updated.getQualification());
        existing.setDesignation(updated.getDesignation());
        existing.setExperience(updated.getExperience());
        existing.setJoiningDate(updated.getJoiningDate());
        
        return facultyRepository.save(existing);
    }

    @Transactional
    public Faculty deactivateTeacher(Long id) {
        Faculty existing = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));
        
        existing.setStatus("Active".equalsIgnoreCase(existing.getStatus()) ? "Inactive" : "Active");
        return facultyRepository.save(existing);
    }
}
