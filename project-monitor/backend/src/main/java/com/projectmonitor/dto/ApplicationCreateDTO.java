package com.projectmonitor.dto;

import com.projectmonitor.model.enums.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class ApplicationCreateDTO {
    @NotBlank
    private String name;
    private String description;
    private LocalDate startDate;
    private ApplicationStatus status;
    @NotNull
    private Long projectId;
    private List<Long> technologyIds;
    private List<String> repositoryUrls;
    private LocalDate lastProductionDeploymentDate;
    private Integer activeCriticalCves;
    private Boolean technicalDocUpToDate;
}
