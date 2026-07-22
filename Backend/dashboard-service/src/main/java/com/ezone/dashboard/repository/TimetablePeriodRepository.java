package com.ezone.dashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ezone.dashboard.entity.TimetablePeriod;

@Repository
public interface TimetablePeriodRepository extends JpaRepository<TimetablePeriod, Long> {
    List<TimetablePeriod> findAllByStatusOrderByPeriodNumberAsc(String status);
}
