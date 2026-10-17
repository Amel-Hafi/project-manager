package com.projectmonitor.dto;

import com.projectmonitor.model.TrafficLightStatus;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectKpiSummaryDTO {
    private Long projectId;
    private String projectName;
    private Double averageIndustrialization;
    private Double averageCodeQuality;
    private Double averageTesting;
    private Double averageDeployment;
    private Double averageObsolescence;
    private Double averageAiAdoption;
    private Double overallAverage;
    private TrafficLightStatus overallStatus;
    private Integer applicationCount;
    private List<MaturityKpiDTO> applicationKpis;
}
