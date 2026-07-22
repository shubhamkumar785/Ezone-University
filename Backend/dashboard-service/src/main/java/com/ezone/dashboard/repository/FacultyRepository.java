package com.ezone.dashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ezone.dashboard.entity.Faculty;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByFacultyId(String facultyId);
    Optional<Faculty> findByEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT MAX(f.facultyId) FROM Faculty f WHERE f.facultyId LIKE 'TCH%'")
    String findMaxFacultyId();
}
