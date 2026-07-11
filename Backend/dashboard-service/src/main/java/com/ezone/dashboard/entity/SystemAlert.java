package com.ezone.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String severity;

    @Column(nullable = false)
    private String timestamp;
}
