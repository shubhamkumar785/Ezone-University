package com.ezone.dashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ezone.dashboard.entity.PracticalMarks;

@Repository
public interface PracticalMarksRepository extends JpaRepository<PracticalMarks, Long> {
    Optional<PracticalMarks> findByEnrollmentId(Long enrollmentId);
    List<PracticalMarks> findByEnrollmentIdIn(List<Long> enrollmentIds);
}
