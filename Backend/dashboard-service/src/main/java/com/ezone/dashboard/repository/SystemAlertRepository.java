package com.ezone.dashboard.repository;

import com.ezone.dashboard.entity.SystemAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemAlertRepository extends JpaRepository<SystemAlert, Long> {
}
