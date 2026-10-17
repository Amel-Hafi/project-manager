package com.projectmonitor.model;

import com.projectmonitor.model.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "application")
@SQLRestriction("deleted = false")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private LocalDate startDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToMany
    @JoinTable(
            name = "application_technology",
            joinColumns = @JoinColumn(name = "application_id"),
            inverseJoinColumns = @JoinColumn(name = "technology_item_id")
    )
    @Builder.Default
    private Set<TechnologyItem> technologies = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "application_repository", joinColumns = @JoinColumn(name = "application_id"))
    @Column(name = "repository_url")
    @Builder.Default
    private List<String> repositoryUrls = new ArrayList<>();

    @Column(name = "last_production_deployment_date")
    private LocalDate lastProductionDeploymentDate;

    @Column(name = "active_critical_cves")
    @Builder.Default
    private Integer activeCriticalCves = 0;

    @Column(name = "technical_doc_up_to_date")
    @Builder.Default
    private Boolean technicalDocUpToDate = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
