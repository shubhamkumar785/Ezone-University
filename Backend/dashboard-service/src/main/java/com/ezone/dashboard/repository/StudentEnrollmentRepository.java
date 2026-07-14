package com.ezone.dashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ezone.dashboard.entity.StudentEnrollment;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {
    List<StudentEnrollment> findByLoginIdAndTermCode(String loginId, String termCode);
    List<StudentEnrollment> findByLoginIdAndTermCodeAndEnrollmentStatus(String loginId, String termCode, String enrollmentStatus);
}
