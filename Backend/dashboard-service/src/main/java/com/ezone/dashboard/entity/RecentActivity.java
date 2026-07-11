package com.ezone.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recent_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String time;

    @Column(nullable = false)
    private String module;

    @Column(nullable = false)
    private String message;

    @Column(name = "status_color")
    private String statusColor;
}
