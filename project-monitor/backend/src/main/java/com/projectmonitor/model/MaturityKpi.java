package com.projectmonitor.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "maturity_kpi")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaturityKpi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    private Integer industrialization;
    private Integer codeQuality;
    private Integer testing;
    private Integer deployment;
    private Integer obsolescence;
    private Integer aiAdoption;

    private String justificationIndustrialization;
    private String justificationCodeQuality;
    private String justificationTesting;
    private String justificationDeployment;
    private String justificationObsolescence;
    private String justificationAiAdoption;
    private LocalDateTime evaluatedAt;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
