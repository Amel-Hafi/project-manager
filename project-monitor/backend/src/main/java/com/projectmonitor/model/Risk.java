package com.projectmonitor.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "risk")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Risk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskSource source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskSeverity severity;

    @Column(length = 1000)
    private String description;

    @Column(name = "action_plan", length = 2000)
    private String actionPlan;

    @Column(nullable = false)
    @Builder.Default
    private Boolean resolved = false;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
