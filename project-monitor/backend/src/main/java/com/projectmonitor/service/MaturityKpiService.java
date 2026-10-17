package com.projectmonitor.service;

import com.projectmonitor.dto.MaturityKpiDTO;
import com.projectmonitor.dto.MaturityKpiUpdateDTO;
import com.projectmonitor.dto.ProjectKpiSummaryDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.Application;
import com.projectmonitor.model.MaturityKpi;
import com.projectmonitor.model.Project;
import com.projectmonitor.model.TrafficLightStatus;
import com.projectmonitor.repository.ApplicationRepository;
import com.projectmonitor.repository.MaturityKpiRepository;
import com.projectmonitor.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MaturityKpiService {

    private final MaturityKpiRepository maturityKpiRepository;
    private final ApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;
    private final AuthorizationService authorizationService;

    public MaturityKpiDTO getByApplication(Long appId) {
        Application application = applicationRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + appId));

        if (!authorizationService.hasAccessToProject(application.getProject().getId())) {
            throw new AccessDeniedException("No access to project " + application.getProject().getId());
        }

        return maturityKpiRepository.findByApplicationId(appId)
                .map(this::toDTO)
                .orElseGet(() -> MaturityKpiDTO.builder()
                        .applicationId(appId)
                        .applicationName(application.getName())
                        .build());
    }

    @Transactional
    public MaturityKpiDTO createOrUpdate(Long appId, MaturityKpiUpdateDTO dto) {
        Application application = applicationRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + appId));

        if (!authorizationService.hasAccessToProject(application.getProject().getId())) {
            throw new AccessDeniedException("No access to project " + application.getProject().getId());
        }

        MaturityKpi kpi = maturityKpiRepository.findByApplicationId(appId)
                .orElseGet(() -> MaturityKpi.builder().application(application).build());

        kpi.setIndustrialization(dto.getIndustrialization());
        kpi.setCodeQuality(dto.getCodeQuality());
        kpi.setTesting(dto.getTesting());
        kpi.setDeployment(dto.getDeployment());
        kpi.setObsolescence(dto.getObsolescence());
        kpi.setAiAdoption(dto.getAiAdoption());
        kpi.setJustificationIndustrialization(dto.getJustificationIndustrialization());
        kpi.setJustificationCodeQuality(dto.getJustificationCodeQuality());
        kpi.setJustificationTesting(dto.getJustificationTesting());
        kpi.setJustificationDeployment(dto.getJustificationDeployment());
        kpi.setJustificationObsolescence(dto.getJustificationObsolescence());
        kpi.setJustificationAiAdoption(dto.getJustificationAiAdoption());
        kpi.setEvaluatedAt(java.time.LocalDateTime.now());

        MaturityKpi saved = maturityKpiRepository.save(kpi);
        return toDTO(saved);
    }

    public ProjectKpiSummaryDTO getProjectSummary(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        if (!authorizationService.hasAccessToProject(projectId)) {
            throw new AccessDeniedException("No access to project " + projectId);
        }

        List<MaturityKpi> kpis = maturityKpiRepository.findByApplicationProjectId(projectId);
        List<MaturityKpiDTO> kpiDtos = kpis.stream().map(this::toDTO).toList();

        Double avgIndustrialization = average(kpis.stream().map(MaturityKpi::getIndustrialization).filter(Objects::nonNull).toList());
        Double avgCodeQuality = average(kpis.stream().map(MaturityKpi::getCodeQuality).filter(Objects::nonNull).toList());
        Double avgTesting = average(kpis.stream().map(MaturityKpi::getTesting).filter(Objects::nonNull).toList());
        Double avgDeployment = average(kpis.stream().map(MaturityKpi::getDeployment).filter(Objects::nonNull).toList());
        Double avgObsolescence = average(kpis.stream().map(MaturityKpi::getObsolescence).filter(Objects::nonNull).toList());
        Double avgAiAdoption = average(kpis.stream().map(MaturityKpi::getAiAdoption).filter(Objects::nonNull).toList());

        Double overallAverage = computeOverallAverage(avgIndustrialization, avgCodeQuality, avgTesting, avgDeployment, avgObsolescence, avgAiAdoption);

        return ProjectKpiSummaryDTO.builder()
                .projectId(projectId)
                .projectName(project.getName())
                .averageIndustrialization(avgIndustrialization)
                .averageCodeQuality(avgCodeQuality)
                .averageTesting(avgTesting)
                .averageDeployment(avgDeployment)
                .averageObsolescence(avgObsolescence)
                .averageAiAdoption(avgAiAdoption)
                .overallAverage(overallAverage)
                .overallStatus(TrafficLightStatus.fromAverage(overallAverage))
                .applicationCount(kpis.size())
                .applicationKpis(kpiDtos)
                .build();
    }

    private Double average(List<Integer> values) {
        if (values.isEmpty()) {
            return null;
        }
        return values.stream().mapToInt(Integer::intValue).average().orElse(0.0);
    }

    private Double computeOverallAverage(Double... axes) {
        List<Double> nonNull = Stream.of(axes).filter(Objects::nonNull).toList();
        if (nonNull.isEmpty()) return null;
        return nonNull.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    private MaturityKpiDTO toDTO(MaturityKpi kpi) {
        return MaturityKpiDTO.builder()
                .id(kpi.getId())
                .applicationId(kpi.getApplication().getId())
                .applicationName(kpi.getApplication().getName())
                .industrialization(kpi.getIndustrialization())
                .codeQuality(kpi.getCodeQuality())
                .testing(kpi.getTesting())
                .deployment(kpi.getDeployment())
                .obsolescence(kpi.getObsolescence())
                .aiAdoption(kpi.getAiAdoption())
                .justificationIndustrialization(kpi.getJustificationIndustrialization())
                .justificationCodeQuality(kpi.getJustificationCodeQuality())
                .justificationTesting(kpi.getJustificationTesting())
                .justificationDeployment(kpi.getJustificationDeployment())
                .justificationObsolescence(kpi.getJustificationObsolescence())
                .justificationAiAdoption(kpi.getJustificationAiAdoption())
                .evaluatedAt(kpi.getEvaluatedAt())
                .updatedAt(kpi.getUpdatedAt())
                .build();
    }
}
