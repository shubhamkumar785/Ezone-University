package com.ezone.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pending_leaves")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingLeave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String employee;

    @Column(nullable = false)
    private String department;

    @Column(name = "leave_type", nullable = false)
    private String leaveType;

    @Column(nullable = false)
    private String status;

    private String initials;
    private String time;
    private String duration;
}
