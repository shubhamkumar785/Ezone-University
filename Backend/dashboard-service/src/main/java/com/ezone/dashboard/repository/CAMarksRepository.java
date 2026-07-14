package com.ezone.dashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ezone.dashboard.entity.CAMarks;

@Repository
public interface CAMarksRepository extends JpaRepository<CAMarks, Long> {
    Optional<CAMarks> findByEnrollmentId(Long enrollmentId);
    List<CAMarks> findByEnrollmentIdIn(List<Long> enrollmentIds);
}
