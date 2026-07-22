package com.ezone.dashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ezone.dashboard.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByLoginId(String loginId);
    Optional<Student> findByStudentId(String studentId);
    Optional<Student> findByRollNumber(String rollNumber);
    java.util.List<Student> findBySection(String section);
}
