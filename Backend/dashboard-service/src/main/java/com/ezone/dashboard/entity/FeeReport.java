package com.ezone.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fee_report")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private Double collected;

    @Column(nullable = false)
    private Double target;
}
