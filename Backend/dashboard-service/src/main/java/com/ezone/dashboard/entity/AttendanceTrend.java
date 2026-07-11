package com.ezone.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attendance_trend")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceTrend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private Integer present;

    @Column(nullable = false)
    private Integer absent;
}
