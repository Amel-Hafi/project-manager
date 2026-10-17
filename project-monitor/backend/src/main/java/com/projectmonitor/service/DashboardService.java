package com.projectmonitor.service;

import com.projectmonitor.dto.ClientKpiSummaryDTO;
import com.projectmonitor.dto.GlobalDashboardDTO;
import com.projectmonitor.dto.ProjectKpiSummaryDTO;
import com.projectmonitor.dto.ReferentWorkloadDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.Application;
import com.projectmonitor.model.Client;
import com.projectmonitor.model.Project;
import com.projectmonitor.model.ProjectAssignment;
import com.projectmonitor.model.TrafficLightStatus;
import com.projectmonitor.model.enums.AssignmentRole;
import com.projectmonitor.repository.ApplicationRepository;
import com.projectmonitor.repository.ClientRepository;
import com.projectmonitor.repository.ProjectAssignmentRepository;
import com.projectmonitor.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ClientRepository clientRepository;
    private final ProjectRepository projectRepository;
    private final ApplicationRepository applicationRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final AuthorizationService authorizationService;
    private final MaturityKpiService maturityKpiService;
    private final TrafficLightEvaluationService trafficLightEvaluationService;

    public ClientKpiSummaryDTO getClientSummary(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + clientId));

        List<Project> projects;
        if (authorizationService.hasUnrestrictedAccess()) {
            projects = projectRepository.findAllByClientId(clientId);
        } else {
            List<Long> assignedIds = authorizationService.getAssignedProjectIds();
            projects = projectRepository.findAllByClientIdAndIdIn(clientId, assignedIds);
        }

        List<ProjectKpiSummaryDTO> projectSummaries = projects.stream()
                .map(project -> maturityKpiService.getProjectSummary(project.getId()))
                .toList();

        int applicationCount = projectSummaries.stream()
                .mapToInt(ProjectKpiSummaryDTO::getApplicationCount)
                .sum();

        Double avgIndustrialization = averageOfDoubles(projectSummaries.stream().map(ProjectKpiSummaryDTO::getAverageIndustrialization).toList());
        Double avgCodeQuality = averageOfDoubles(projectSummaries.stream().map(ProjectKpiSummaryDTO::getAverageCodeQuality).toList());
        Double avgTesting = averageOfDoubles(projectSummaries.stream().map(ProjectKpiSummaryDTO::getAverageTesting).toList());
        Double avgDeployment = averageOfDoubles(projectSummaries.stream().map(ProjectKpiSummaryDTO::getAverageDeployment).toList());
        Double avgObsolescence = averageOfDoubles(projectSummaries.stream().map(ProjectKpiSummaryDTO::getAverageObsolescence).toList());
        Double avgAiAdoption = averageOfDoubles(projectSummaries.stream().map(ProjectKpiSummaryDTO::getAverageAiAdoption).toList());

        Double overallAverage = computeOverallAverage(avgIndustrialization, avgCodeQuality, avgTesting, avgDeployment, avgObsolescence, avgAiAdoption);

        return ClientKpiSummaryDTO.builder()
                .clientId(clientId)
                .clientName(client.getName())
                .averageIndustrialization(avgIndustrialization)
                .averageCodeQuality(avgCodeQuality)
                .averageTesting(avgTesting)
                .averageDeployment(avgDeployment)
                .averageObsolescence(avgObsolescence)
                .averageAiAdoption(avgAiAdoption)
                .overallAverage(overallAverage)
                .overallStatus(trafficLightEvaluationService.evaluateClient(clientId))
                .projectCount(projects.size())
                .applicationCount(applicationCount)
                .projectSummaries(projectSummaries)
                .build();
    }

    public GlobalDashboardDTO getGlobalDashboard() {
        List<Client> clients;
        if (authorizationService.hasUnrestrictedAccess()) {
            clients = clientRepository.findAll();
        } else {
            List<Long> assignedIds = authorizationService.getAssignedProjectIds();
            clients = clientRepository.findDistinctByProjectIds(assignedIds);
        }

        List<ClientKpiSummaryDTO> clientSummaries = clients.stream()
                .map(client -> getClientSummary(client.getId()))
                .filter(summary -> summary.getProjectCount() > 0)
                .toList();

        int totalProjects = clientSummaries.stream().mapToInt(ClientKpiSummaryDTO::getProjectCount).sum();
        int totalApplications = clientSummaries.stream().mapToInt(ClientKpiSummaryDTO::getApplicationCount).sum();

        Double avgIndustrialization = averageOfDoubles(clientSummaries.stream().map(ClientKpiSummaryDTO::getAverageIndustrialization).toList());
        Double avgCodeQuality = averageOfDoubles(clientSummaries.stream().map(ClientKpiSummaryDTO::getAverageCodeQuality).toList());
        Double avgTesting = averageOfDoubles(clientSummaries.stream().map(ClientKpiSummaryDTO::getAverageTesting).toList());
        Double avgDeployment = averageOfDoubles(clientSummaries.stream().map(ClientKpiSummaryDTO::getAverageDeployment).toList());
        Double avgObsolescence = averageOfDoubles(clientSummaries.stream().map(ClientKpiSummaryDTO::getAverageObsolescence).toList());
        Double avgAiAdoption = averageOfDoubles(clientSummaries.stream().map(ClientKpiSummaryDTO::getAverageAiAdoption).toList());

        Double overallAverage = computeOverallAverage(avgIndustrialization, avgCodeQuality, avgTesting, avgDeployment, avgObsolescence, avgAiAdoption);

        // Compute additional KPIs — filtered by accessible projects
        List<Long> accessibleProjectIds = clientSummaries.stream()
                .flatMap(cs -> cs.getProjectSummaries().stream())
                .map(ProjectKpiSummaryDTO::getProjectId)
                .distinct()
                .toList();
        List<Application> accessibleApplications = accessibleProjectIds.isEmpty() ?
                List.of() :
                accessibleProjectIds.stream()
                        .flatMap(pid -> applicationRepository.findByProjectId(pid, org.springframework.data.domain.Pageable.unpaged()).getContent().stream())
                        .toList();
        long docUpToDateCount = accessibleApplications.stream()
                .filter(app -> Boolean.TRUE.equals(app.getTechnicalDocUpToDate()))
                .count();
        Double docUpToDateRatio = accessibleApplications.isEmpty() ? null :
                (docUpToDateCount * 100.0) / accessibleApplications.size();
        Integer totalCriticalCves = accessibleApplications.stream()
                .map(Application::getActiveCriticalCves)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();

        return GlobalDashboardDTO.builder()
                .totalClients(clientSummaries.size())
                .totalProjects(totalProjects)
                .totalApplications(totalApplications)
                .averageIndustrialization(avgIndustrialization)
                .averageCodeQuality(avgCodeQuality)
                .averageTesting(avgTesting)
                .averageDeployment(avgDeployment)
                .averageObsolescence(avgObsolescence)
                .averageAiAdoption(avgAiAdoption)
                .overallAverage(overallAverage)
                .overallStatus(TrafficLightStatus.fromAverage(overallAverage))
                .docUpToDateRatio(docUpToDateRatio)
                .totalCriticalCves(totalCriticalCves)
                .clientSummaries(clientSummaries)
                .build();
    }

    public List<ReferentWorkloadDTO> getReferentWorkload() {
        List<ProjectAssignment> referentAssignments = projectAssignmentRepository.findByRole(AssignmentRole.DT_REFERENT);

        Map<Long, List<ProjectAssignment>> byUser = referentAssignments.stream()
                .collect(Collectors.groupingBy(a -> a.getUser().getId()));

        return byUser.entrySet().stream()
                .map(entry -> {
                    List<ProjectAssignment> assignments = entry.getValue();
                    ProjectAssignment first = assignments.get(0);
                    List<Long> projectIds = assignments.stream()
                            .map(a -> a.getProject().getId())
                            .distinct()
                            .toList();
                    long applicationCount = projectIds.stream()
                            .mapToLong(pid -> applicationRepository.findByProjectId(pid,
                                    org.springframework.data.domain.Pageable.unpaged()).getTotalElements())
                            .sum();
                    return ReferentWorkloadDTO.builder()
                            .userId(first.getUser().getId())
                            .username(first.getUser().getUsername())
                            .fullName(first.getUser().getFirstName() + " " + first.getUser().getLastName())
                            .applicationCount((int) applicationCount)
                            .projectCount(projectIds.size())
                            .build();
                })
                .toList();
    }

    private Double averageOfDoubles(List<Double> values) {
        List<Double> nonNull = values.stream().filter(Objects::nonNull).toList();
        if (nonNull.isEmpty()) return null;
        return nonNull.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    private Double computeOverallAverage(Double... axes) {
        List<Double> nonNull = Stream.of(axes).filter(Objects::nonNull).toList();
        if (nonNull.isEmpty()) return null;
        return nonNull.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }
}
