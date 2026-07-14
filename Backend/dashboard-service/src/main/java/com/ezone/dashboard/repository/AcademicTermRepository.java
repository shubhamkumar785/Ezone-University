package com.ezone.dashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ezone.dashboard.entity.AcademicTerm;

@Repository
public interface AcademicTermRepository extends JpaRepository<AcademicTerm, Long> {
    Optional<AcademicTerm> findByTermCode(String termCode);
    Optional<AcademicTerm> findByIsActiveTrue();
    List<AcademicTerm> findAllByStatusOrderByYearDescTermCodeDesc(String status);
    List<AcademicTerm> findAllByOrderByYearDescTermCodeDesc();
}
