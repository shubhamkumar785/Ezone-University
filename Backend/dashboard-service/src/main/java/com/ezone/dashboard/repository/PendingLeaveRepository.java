package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.PendingLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PendingLeaveRepository extends JpaRepository<PendingLeave, Long> {
}
