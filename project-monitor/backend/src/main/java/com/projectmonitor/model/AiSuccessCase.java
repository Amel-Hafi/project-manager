package com.projectmonitor.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_success_case")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiSuccessCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String tool;

    @Column(nullable = false, length = 100)
    private String profile;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String estimatedImpact;

    private LocalDate caseDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AiCaseStatus status;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
