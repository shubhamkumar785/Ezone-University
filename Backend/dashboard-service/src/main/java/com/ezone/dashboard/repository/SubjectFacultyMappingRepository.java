package com.ezone.dashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ezone.dashboard.entity.SubjectFacultyMapping;

@Repository
public interface SubjectFacultyMappingRepository extends JpaRepository<SubjectFacultyMapping, Long> {
    List<SubjectFacultyMapping> findBySubjectIdAndTermCode(Long subjectId, String termCode);
    Optional<SubjectFacultyMapping> findBySubjectIdAndTermCodeAndStatus(Long subjectId, String termCode, String status);
    List<SubjectFacultyMapping> findBySubjectIdInAndTermCodeAndStatus(List<Long> subjectIds, String termCode, String status);
}
