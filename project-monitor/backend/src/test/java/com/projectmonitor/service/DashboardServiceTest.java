package com.projectmonitor.service;

import com.projectmonitor.dto.ClientKpiSummaryDTO;
import com.projectmonitor.dto.GlobalDashboardDTO;
import com.projectmonitor.dto.ProjectKpiSummaryDTO;
import com.projectmonitor.dto.ReferentWorkloadDTO;
import com.projectmonitor.model.AppUser;
import com.projectmonitor.model.Application;
import com.projectmonitor.model.Client;
import com.projectmonitor.model.Project;
import com.projectmonitor.model.ProjectAssignment;
import com.projectmonitor.model.TrafficLightStatus;
import com.projectmonitor.model.enums.AssignmentRole;
import com.projectmonitor.model.enums.UserRole;
import com.projectmonitor.repository.ApplicationRepository;
import com.projectmonitor.repository.ClientRepository;
import com.projectmonitor.repository.ProjectAssignmentRepository;
import com.projectmonitor.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private ProjectAssignmentRepository projectAssignmentRepository;

    @Mock
    private AuthorizationService authorizationService;

    @Mock
    private MaturityKpiService maturityKpiService;

    @Mock
    private TrafficLightEvaluationService trafficLightEvaluationService;

    @InjectMocks
    private DashboardService dashboardService;

    private Client client;
    private Project project1;
    private Project project2;

    @BeforeEach
    void setUp() {
        project1 = Project.builder().id(1L).name("Project One").build();
        project2 = Project.builder().id(2L).name("Project Two").build();
        client = Client.builder().id(10L).name("Client A").projects(new ArrayList<>(List.of(project1, project2))).build();
        project1.setClient(client);
        project2.setClient(client);

        // Default: evaluation service falls back to GREEN (will be overridden per test if needed)
        lenient().when(trafficLightEvaluationService.evaluateClient(anyLong()))
                .thenAnswer(invocation -> TrafficLightStatus.GREEN);
    }

    @Test
    void getClientSummary_withMultipleProjects_calculatesCorrectAverages() {
        when(clientRepository.findById(10L)).thenReturn(Optional.of(client));
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(true);
        when(projectRepository.findAllByClientId(10L)).thenReturn(List.of(project1, project2));

        ProjectKpiSummaryDTO summary1 = ProjectKpiSummaryDTO.builder()
                .projectId(1L).projectName("Project One")
                .averageIndustrialization(8.0).averageCodeQuality(7.0).averageTesting(6.0)
                .averageDeployment(9.0).averageObsolescence(5.0).averageAiAdoption(7.0)
                .overallAverage(7.0).overallStatus(TrafficLightStatus.GREEN)
                .applicationCount(2).applicationKpis(List.of())
                .build();

        ProjectKpiSummaryDTO summary2 = ProjectKpiSummaryDTO.builder()
                .projectId(2L).projectName("Project Two")
                .averageIndustrialization(6.0).averageCodeQuality(5.0).averageTesting(4.0)
                .averageDeployment(7.0).averageObsolescence(3.0).averageAiAdoption(5.0)
                .overallAverage(5.0).overallStatus(TrafficLightStatus.YELLOW)
                .applicationCount(1).applicationKpis(List.of())
                .build();

        when(maturityKpiService.getProjectSummary(1L)).thenReturn(summary1);
        when(maturityKpiService.getProjectSummary(2L)).thenReturn(summary2);

        ClientKpiSummaryDTO result = dashboardService.getClientSummary(10L);

        assertThat(result.getClientId()).isEqualTo(10L);
        assertThat(result.getClientName()).isEqualTo("Client A");
        assertThat(result.getProjectCount()).isEqualTo(2);
        assertThat(result.getApplicationCount()).isEqualTo(3);
        assertThat(result.getAverageIndustrialization()).isEqualTo(7.0);
        assertThat(result.getAverageCodeQuality()).isEqualTo(6.0);
        assertThat(result.getAverageTesting()).isEqualTo(5.0);
        assertThat(result.getAverageDeployment()).isEqualTo(8.0);
        assertThat(result.getAverageObsolescence()).isEqualTo(4.0);
        assertThat(result.getAverageAiAdoption()).isEqualTo(6.0);
        assertThat(result.getProjectSummaries()).hasSize(2);
    }

    @Test
    void getClientSummary_greenStatus_whenAverageAbove7() {
        when(clientRepository.findById(10L)).thenReturn(Optional.of(client));
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(true);
        when(projectRepository.findAllByClientId(10L)).thenReturn(List.of(project1));

        ProjectKpiSummaryDTO summary = ProjectKpiSummaryDTO.builder()
                .projectId(1L).projectName("Project One")
                .averageIndustrialization(8.0).averageCodeQuality(8.0).averageTesting(8.0)
                .averageDeployment(8.0).averageObsolescence(8.0).averageAiAdoption(8.0)
                .overallAverage(8.0).overallStatus(TrafficLightStatus.GREEN)
                .applicationCount(1).applicationKpis(List.of())
                .build();

        when(maturityKpiService.getProjectSummary(1L)).thenReturn(summary);

        ClientKpiSummaryDTO result = dashboardService.getClientSummary(10L);

        assertThat(result.getOverallStatus()).isEqualTo(TrafficLightStatus.GREEN);
        assertThat(result.getOverallAverage()).isEqualTo(8.0);
    }

    @Test
    void getClientSummary_yellowStatus_whenAverageBetween4And7() {
        when(clientRepository.findById(10L)).thenReturn(Optional.of(client));
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(true);
        when(projectRepository.findAllByClientId(10L)).thenReturn(List.of(project1));
        when(trafficLightEvaluationService.evaluateClient(10L)).thenReturn(TrafficLightStatus.YELLOW);

        ProjectKpiSummaryDTO summary = ProjectKpiSummaryDTO.builder()
                .projectId(1L).projectName("Project One")
                .averageIndustrialization(5.0).averageCodeQuality(5.0).averageTesting(5.0)
                .averageDeployment(5.0).averageObsolescence(5.0).averageAiAdoption(5.0)
                .overallAverage(5.0).overallStatus(TrafficLightStatus.YELLOW)
                .applicationCount(1).applicationKpis(List.of())
                .build();

        when(maturityKpiService.getProjectSummary(1L)).thenReturn(summary);

        ClientKpiSummaryDTO result = dashboardService.getClientSummary(10L);

        assertThat(result.getOverallStatus()).isEqualTo(TrafficLightStatus.YELLOW);
    }

    @Test
    void getClientSummary_redStatus_whenAverageBelow4() {
        when(clientRepository.findById(10L)).thenReturn(Optional.of(client));
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(true);
        when(projectRepository.findAllByClientId(10L)).thenReturn(List.of(project1));
        when(trafficLightEvaluationService.evaluateClient(10L)).thenReturn(TrafficLightStatus.RED);

        ProjectKpiSummaryDTO summary = ProjectKpiSummaryDTO.builder()
                .projectId(1L).projectName("Project One")
                .averageIndustrialization(2.0).averageCodeQuality(3.0).averageTesting(2.0)
                .averageDeployment(3.0).averageObsolescence(2.0).averageAiAdoption(3.0)
                .overallAverage(2.5).overallStatus(TrafficLightStatus.RED)
                .applicationCount(1).applicationKpis(List.of())
                .build();

        when(maturityKpiService.getProjectSummary(1L)).thenReturn(summary);

        ClientKpiSummaryDTO result = dashboardService.getClientSummary(10L);

        assertThat(result.getOverallStatus()).isEqualTo(TrafficLightStatus.RED);
    }

    @Test
    void getClientSummary_restrictedUser_onlySeesAssignedProjects() {
        when(clientRepository.findById(10L)).thenReturn(Optional.of(client));
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(false);
        when(authorizationService.getAssignedProjectIds()).thenReturn(List.of(1L));
        when(projectRepository.findAllByClientIdAndIdIn(10L, List.of(1L))).thenReturn(List.of(project1));

        ProjectKpiSummaryDTO summary1 = ProjectKpiSummaryDTO.builder()
                .projectId(1L).projectName("Project One")
                .averageIndustrialization(7.0).averageCodeQuality(7.0).averageTesting(7.0)
                .averageDeployment(7.0).averageObsolescence(7.0).averageAiAdoption(7.0)
                .overallAverage(7.0).overallStatus(TrafficLightStatus.GREEN)
                .applicationCount(2).applicationKpis(List.of())
                .build();

        when(maturityKpiService.getProjectSummary(1L)).thenReturn(summary1);

        ClientKpiSummaryDTO result = dashboardService.getClientSummary(10L);

        assertThat(result.getProjectCount()).isEqualTo(1);
        assertThat(result.getProjectSummaries()).hasSize(1);
        verify(projectRepository, never()).findAllByClientId(anyLong());
    }

    @Test
    void getGlobalDashboard_aggregatesAllClients() {
        Client client2 = Client.builder().id(20L).name("Client B").projects(new ArrayList<>(List.of(project2))).build();

        when(authorizationService.hasUnrestrictedAccess()).thenReturn(true);
        when(clientRepository.findAll()).thenReturn(List.of(client, client2));
        when(clientRepository.findById(10L)).thenReturn(Optional.of(client));
        when(clientRepository.findById(20L)).thenReturn(Optional.of(client2));
        when(projectRepository.findAllByClientId(10L)).thenReturn(List.of(project1));
        when(projectRepository.findAllByClientId(20L)).thenReturn(List.of(project2));

        ProjectKpiSummaryDTO summary1 = ProjectKpiSummaryDTO.builder()
                .projectId(1L).projectName("Project One")
                .averageIndustrialization(8.0).averageCodeQuality(8.0).averageTesting(8.0)
                .averageDeployment(8.0).averageObsolescence(8.0).averageAiAdoption(8.0)
                .overallAverage(8.0).overallStatus(TrafficLightStatus.GREEN)
                .applicationCount(2).applicationKpis(List.of())
                .build();

        ProjectKpiSummaryDTO summary2 = ProjectKpiSummaryDTO.builder()
                .projectId(2L).projectName("Project Two")
                .averageIndustrialization(6.0).averageCodeQuality(6.0).averageTesting(6.0)
                .averageDeployment(6.0).averageObsolescence(6.0).averageAiAdoption(6.0)
                .overallAverage(6.0).overallStatus(TrafficLightStatus.YELLOW)
                .applicationCount(1).applicationKpis(List.of())
                .build();

        when(maturityKpiService.getProjectSummary(1L)).thenReturn(summary1);
        when(maturityKpiService.getProjectSummary(2L)).thenReturn(summary2);
        when(applicationRepository.findByProjectId(eq(1L), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));
        when(applicationRepository.findByProjectId(eq(2L), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));

        GlobalDashboardDTO result = dashboardService.getGlobalDashboard();

        assertThat(result.getTotalClients()).isEqualTo(2);
        assertThat(result.getTotalProjects()).isEqualTo(2);
        assertThat(result.getTotalApplications()).isEqualTo(3);
        assertThat(result.getAverageIndustrialization()).isEqualTo(7.0);
        assertThat(result.getClientSummaries()).hasSize(2);
        assertThat(result.getOverallStatus()).isEqualTo(TrafficLightStatus.GREEN);
    }

    @Test
    void getGlobalDashboard_restrictedUser_filtersClientsByAccess() {
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(false);
        when(authorizationService.getAssignedProjectIds()).thenReturn(List.of(1L));

        Client client2 = Client.builder().id(20L).name("Client B").projects(new ArrayList<>()).build();
        when(clientRepository.findDistinctByProjectIds(List.of(1L))).thenReturn(List.of(client));
        when(clientRepository.findById(10L)).thenReturn(Optional.of(client));
        when(projectRepository.findAllByClientIdAndIdIn(10L, List.of(1L))).thenReturn(List.of(project1));

        ProjectKpiSummaryDTO summary1 = ProjectKpiSummaryDTO.builder()
                .projectId(1L).projectName("Project One")
                .averageIndustrialization(7.0).averageCodeQuality(7.0).averageTesting(7.0)
                .averageDeployment(7.0).averageObsolescence(7.0).averageAiAdoption(7.0)
                .overallAverage(7.0).overallStatus(TrafficLightStatus.GREEN)
                .applicationCount(1).applicationKpis(List.of())
                .build();

        when(maturityKpiService.getProjectSummary(1L)).thenReturn(summary1);
        when(applicationRepository.findByProjectId(eq(1L), any(Pageable.class))).thenReturn(new PageImpl<>(List.of()));

        GlobalDashboardDTO result = dashboardService.getGlobalDashboard();

        // Client B has no matching projects, so it's filtered
        assertThat(result.getTotalClients()).isEqualTo(1);
        assertThat(result.getClientSummaries()).hasSize(1);
        assertThat(result.getClientSummaries().get(0).getClientName()).isEqualTo("Client A");
    }

    @Test
    void getGlobalDashboard_includesDocUpToDateRatioAndCriticalCves() {
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(true);
        when(clientRepository.findAll()).thenReturn(List.of(client));
        when(clientRepository.findById(10L)).thenReturn(Optional.of(client));
        when(projectRepository.findAllByClientId(10L)).thenReturn(List.of(project1));

        ProjectKpiSummaryDTO summary = ProjectKpiSummaryDTO.builder()
                .projectId(1L).projectName("Project One")
                .averageIndustrialization(7.0).averageCodeQuality(7.0).averageTesting(7.0)
                .averageDeployment(7.0).averageObsolescence(7.0).averageAiAdoption(7.0)
                .overallAverage(7.0).overallStatus(TrafficLightStatus.GREEN)
                .applicationCount(2).applicationKpis(List.of())
                .build();
        when(maturityKpiService.getProjectSummary(1L)).thenReturn(summary);

        Application app1 = Application.builder().id(1L).technicalDocUpToDate(true).activeCriticalCves(2).build();
        Application app2 = Application.builder().id(2L).technicalDocUpToDate(false).activeCriticalCves(3).build();
        when(applicationRepository.findByProjectId(eq(1L), any(Pageable.class))).thenReturn(new PageImpl<>(List.of(app1, app2)));

        GlobalDashboardDTO result = dashboardService.getGlobalDashboard();

        assertThat(result.getDocUpToDateRatio()).isEqualTo(50.0);
        assertThat(result.getTotalCriticalCves()).isEqualTo(5);
    }

    @Test
    void getReferentWorkload_returnsCorrectCounts() {
        AppUser user1 = AppUser.builder().id(1L).username("john").firstName("John").lastName("Doe").role(UserRole.DT_REFERENT).build();
        AppUser user2 = AppUser.builder().id(2L).username("jane").firstName("Jane").lastName("Smith").role(UserRole.DT_REFERENT).build();

        ProjectAssignment pa1 = ProjectAssignment.builder().id(1L).user(user1).project(project1).role(AssignmentRole.DT_REFERENT).build();
        ProjectAssignment pa2 = ProjectAssignment.builder().id(2L).user(user1).project(project2).role(AssignmentRole.DT_REFERENT).build();
        ProjectAssignment pa3 = ProjectAssignment.builder().id(3L).user(user2).project(project1).role(AssignmentRole.DT_REFERENT).build();

        when(projectAssignmentRepository.findByRole(AssignmentRole.DT_REFERENT)).thenReturn(List.of(pa1, pa2, pa3));

        Application app1 = Application.builder().id(10L).name("App1").project(project1).build();
        Application app2 = Application.builder().id(11L).name("App2").project(project2).build();
        when(applicationRepository.findByProjectId(eq(1L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(app1)));
        when(applicationRepository.findByProjectId(eq(2L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(app2)));

        List<ReferentWorkloadDTO> result = dashboardService.getReferentWorkload();

        assertThat(result).hasSize(2);
        ReferentWorkloadDTO johnWorkload = result.stream().filter(r -> r.getUserId().equals(1L)).findFirst().orElseThrow();
        assertThat(johnWorkload.getProjectCount()).isEqualTo(2);
        assertThat(johnWorkload.getApplicationCount()).isEqualTo(2);
        assertThat(johnWorkload.getFullName()).isEqualTo("John Doe");

        ReferentWorkloadDTO janeWorkload = result.stream().filter(r -> r.getUserId().equals(2L)).findFirst().orElseThrow();
        assertThat(janeWorkload.getProjectCount()).isEqualTo(1);
        assertThat(janeWorkload.getApplicationCount()).isEqualTo(1);
    }
}
