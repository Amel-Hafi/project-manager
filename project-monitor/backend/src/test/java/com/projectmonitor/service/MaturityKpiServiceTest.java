package com.projectmonitor.service;

import com.projectmonitor.dto.MaturityKpiDTO;
import com.projectmonitor.dto.MaturityKpiUpdateDTO;
import com.projectmonitor.dto.ProjectKpiSummaryDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.Application;
import com.projectmonitor.model.MaturityKpi;
import com.projectmonitor.model.Project;
import com.projectmonitor.repository.ApplicationRepository;
import com.projectmonitor.repository.MaturityKpiRepository;
import com.projectmonitor.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MaturityKpiServiceTest {

    @Mock
    private MaturityKpiRepository maturityKpiRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private MaturityKpiService maturityKpiService;

    private Project project;
    private Application application;
    private MaturityKpi kpi;

    @BeforeEach
    void setUp() {
        project = Project.builder().id(1L).name("Project Alpha").build();
        application = Application.builder().id(10L).name("App One").project(project).build();
        kpi = MaturityKpi.builder()
                .id(100L)
                .application(application)
                .industrialization(7)
                .codeQuality(8)
                .testing(6)
                .deployment(9)
                .obsolescence(5)
                .aiAdoption(4)
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getByApplication_whenKpiExists_returnsDTO() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));

        MaturityKpiDTO result = maturityKpiService.getByApplication(10L);

        assertThat(result.getId()).isEqualTo(100L);
        assertThat(result.getApplicationId()).isEqualTo(10L);
        assertThat(result.getApplicationName()).isEqualTo("App One");
        assertThat(result.getIndustrialization()).isEqualTo(7);
        assertThat(result.getCodeQuality()).isEqualTo(8);
    }

    @Test
    void getByApplication_whenKpiDoesNotExist_returnsEmptyDTO() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.empty());

        MaturityKpiDTO result = maturityKpiService.getByApplication(10L);

        assertThat(result.getId()).isNull();
        assertThat(result.getApplicationId()).isEqualTo(10L);
        assertThat(result.getApplicationName()).isEqualTo("App One");
        assertThat(result.getIndustrialization()).isNull();
    }

    @Test
    void getByApplication_whenApplicationNotFound_throwsException() {
        when(applicationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> maturityKpiService.getByApplication(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getByApplication_whenNoAccess_throwsAccessDenied() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(false);

        assertThatThrownBy(() -> maturityKpiService.getByApplication(10L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void createOrUpdate_whenCreatingNew_savesAndReturnsDTO() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.empty());
        when(maturityKpiRepository.save(any(MaturityKpi.class))).thenAnswer(invocation -> {
            MaturityKpi saved = invocation.getArgument(0);
            saved.setId(100L);
            return saved;
        });

        MaturityKpiUpdateDTO dto = new MaturityKpiUpdateDTO();
        dto.setIndustrialization(7);
        dto.setCodeQuality(8);
        dto.setTesting(6);
        dto.setDeployment(9);
        dto.setObsolescence(5);
        dto.setAiAdoption(4);

        MaturityKpiDTO result = maturityKpiService.createOrUpdate(10L, dto);

        assertThat(result.getId()).isEqualTo(100L);
        assertThat(result.getIndustrialization()).isEqualTo(7);
        verify(maturityKpiRepository).save(any(MaturityKpi.class));
    }

    @Test
    void createOrUpdate_whenUpdatingExisting_updatesAndReturnsDTO() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));
        when(maturityKpiRepository.save(any(MaturityKpi.class))).thenReturn(kpi);

        MaturityKpiUpdateDTO dto = new MaturityKpiUpdateDTO();
        dto.setIndustrialization(10);
        dto.setCodeQuality(10);
        dto.setTesting(10);
        dto.setDeployment(10);
        dto.setObsolescence(10);
        dto.setAiAdoption(10);

        MaturityKpiDTO result = maturityKpiService.createOrUpdate(10L, dto);

        assertThat(result.getId()).isEqualTo(100L);
        verify(maturityKpiRepository).save(kpi);
    }

    @Test
    void createOrUpdate_whenNoAccess_throwsAccessDenied() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(false);

        MaturityKpiUpdateDTO dto = new MaturityKpiUpdateDTO();

        assertThatThrownBy(() -> maturityKpiService.createOrUpdate(10L, dto))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void getProjectSummary_withMultipleApps_returnsAggregatedSummary() {
        Application app2 = Application.builder().id(11L).name("App Two").project(project).build();
        MaturityKpi kpi2 = MaturityKpi.builder()
                .id(101L)
                .application(app2)
                .industrialization(3)
                .codeQuality(4)
                .testing(2)
                .deployment(5)
                .obsolescence(7)
                .aiAdoption(6)
                .updatedAt(LocalDateTime.now())
                .build();

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(maturityKpiRepository.findByApplicationProjectId(1L)).thenReturn(List.of(kpi, kpi2));

        ProjectKpiSummaryDTO result = maturityKpiService.getProjectSummary(1L);

        assertThat(result.getProjectId()).isEqualTo(1L);
        assertThat(result.getProjectName()).isEqualTo("Project Alpha");
        assertThat(result.getApplicationCount()).isEqualTo(2);
        assertThat(result.getAverageIndustrialization()).isEqualTo(5.0);
        assertThat(result.getAverageCodeQuality()).isEqualTo(6.0);
        assertThat(result.getApplicationKpis()).hasSize(2);
    }

    @Test
    void getProjectSummary_whenNoAccess_throwsAccessDenied() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(false);

        assertThatThrownBy(() -> maturityKpiService.getProjectSummary(1L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void createOrUpdate_withJustifications_persistsJustificationsAndEvaluatedAt() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.empty());
        when(maturityKpiRepository.save(any(MaturityKpi.class))).thenAnswer(invocation -> {
            MaturityKpi saved = invocation.getArgument(0);
            saved.setId(100L);
            return saved;
        });

        MaturityKpiUpdateDTO dto = new MaturityKpiUpdateDTO();
        dto.setIndustrialization(7);
        dto.setCodeQuality(8);
        dto.setTesting(6);
        dto.setDeployment(9);
        dto.setObsolescence(5);
        dto.setAiAdoption(4);
        dto.setJustificationIndustrialization("CI/CD pipeline in place");
        dto.setJustificationCodeQuality("SonarQube gate passed");
        dto.setJustificationTesting("80% coverage");
        dto.setJustificationDeployment("Automated deployments");
        dto.setJustificationObsolescence("Some legacy libs");
        dto.setJustificationAiAdoption("Copilot used");

        MaturityKpiDTO result = maturityKpiService.createOrUpdate(10L, dto);

        assertThat(result.getJustificationIndustrialization()).isEqualTo("CI/CD pipeline in place");
        assertThat(result.getJustificationCodeQuality()).isEqualTo("SonarQube gate passed");
        assertThat(result.getJustificationTesting()).isEqualTo("80% coverage");
        assertThat(result.getJustificationDeployment()).isEqualTo("Automated deployments");
        assertThat(result.getJustificationObsolescence()).isEqualTo("Some legacy libs");
        assertThat(result.getJustificationAiAdoption()).isEqualTo("Copilot used");
        assertThat(result.getEvaluatedAt()).isNotNull();

        verify(maturityKpiRepository).save(argThat(kpiArg ->
                kpiArg.getJustificationIndustrialization().equals("CI/CD pipeline in place") &&
                kpiArg.getEvaluatedAt() != null
        ));
    }

    @Test
    void getByApplication_whenKpiExists_returnsJustificationsAndEvaluatedAt() {
        kpi.setJustificationIndustrialization("Justified");
        kpi.setEvaluatedAt(LocalDateTime.of(2026, 6, 1, 10, 0));

        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));

        MaturityKpiDTO result = maturityKpiService.getByApplication(10L);

        assertThat(result.getJustificationIndustrialization()).isEqualTo("Justified");
        assertThat(result.getEvaluatedAt()).isEqualTo(LocalDateTime.of(2026, 6, 1, 10, 0));
    }
}
