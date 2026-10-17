package com.projectmonitor.dto;

import com.projectmonitor.model.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private ApplicationStatus status;
    private Long projectId;
    private String projectName;
    private List<TechnologyItemDTO> technologies;
    private List<String> repositoryUrls;
    private LocalDate lastProductionDeploymentDate;
    private Integer activeCriticalCves;
    private Boolean technicalDocUpToDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
