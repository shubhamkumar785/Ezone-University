package com.ezone.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "enrollment_trend")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentTrend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private Integer students;
}
