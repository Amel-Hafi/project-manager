package com.projectmonitor.dto;

import com.projectmonitor.model.TrafficLightStatus;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalDashboardDTO {
    private Integer totalClients;
    private Integer totalProjects;
    private Integer totalApplications;
    private Double averageIndustrialization;
    private Double averageCodeQuality;
    private Double averageTesting;
    private Double averageDeployment;
    private Double averageObsolescence;
    private Double averageAiAdoption;
    private Double overallAverage;
    private TrafficLightStatus overallStatus;
    private Double docUpToDateRatio;
    private Integer totalCriticalCves;
    private List<ClientKpiSummaryDTO> clientSummaries;
}
