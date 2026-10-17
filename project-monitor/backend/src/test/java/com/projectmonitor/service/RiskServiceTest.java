package com.projectmonitor.service;

import com.projectmonitor.dto.RiskCreateDTO;
import com.projectmonitor.dto.RiskDTO;
import com.projectmonitor.dto.RiskUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.*;
import com.projectmonitor.repository.ApplicationRepository;
import com.projectmonitor.repository.MaturityKpiRepository;
import com.projectmonitor.repository.RiskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RiskServiceTest {

    @Mock
    private RiskRepository riskRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private MaturityKpiRepository maturityKpiRepository;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private RiskService riskService;

    private Project project;
    private Application application;
    private Risk manualRisk;
    private Risk autoRisk;
    private AppUser currentUser;

    @BeforeEach
    void setUp() {
        project = Project.builder().id(1L).name("Project").build();
        application = Application.builder().id(10L).name("App").project(project).build();
        currentUser = AppUser.builder().id(5L).username("testuser").build();

        manualRisk = Risk.builder()
                .id(100L)
                .application(application)
                .type(RiskType.SECURITY)
                .source(RiskSource.MANUAL)
                .severity(RiskSeverity.HIGH)
                .description("Manual risk")
                .resolved(false)
                .createdBy("testuser")
                .build();

        autoRisk = Risk.builder()
                .id(101L)
                .application(application)
                .type(RiskType.SECURITY)
                .source(RiskSource.AUTO)
                .severity(RiskSeverity.HIGH)
                .description("Auto risk")
                .resolved(false)
                .createdBy("SYSTEM")
                .build();
    }

    @Test
    void getRisksByApplicationId_returnsRisks() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        doNothing().when(authorizationService).checkAccessToProject(1L);
        when(riskRepository.findByApplicationId(10L)).thenReturn(List.of(manualRisk));

        List<RiskDTO> result = riskService.getRisksByApplicationId(10L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDescription()).isEqualTo("Manual risk");
        assertThat(result.get(0).getApplicationId()).isEqualTo(10L);
    }

    @Test
    void getRisksByApplicationId_throwsAccessDenied() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        doThrow(new AccessDeniedException("Access denied to project 1"))
                .when(authorizationService).checkAccessToProject(1L);

        assertThatThrownBy(() -> riskService.getRisksByApplicationId(10L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void createManualRisk_createsWithCorrectFields() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        doNothing().when(authorizationService).checkAccessToProject(1L);
        when(authorizationService.getCurrentUser()).thenReturn(currentUser);
        when(riskRepository.save(any(Risk.class))).thenReturn(manualRisk);

        RiskCreateDTO dto = new RiskCreateDTO(RiskType.SECURITY, RiskSeverity.HIGH, "Manual risk", null);
        RiskDTO result = riskService.createManualRisk(10L, dto);

        assertThat(result.getSource()).isEqualTo(RiskSource.MANUAL);
        assertThat(result.getType()).isEqualTo(RiskType.SECURITY);
        verify(riskRepository).save(argThat(r -> r.getSource() == RiskSource.MANUAL));
    }

    @Test
    void updateRisk_throwsForAutoRisks() {
        when(riskRepository.findById(101L)).thenReturn(Optional.of(autoRisk));

        RiskUpdateDTO dto = new RiskUpdateDTO(RiskSeverity.LOW, null, null, null);

        assertThatThrownBy(() -> riskService.updateRisk(10L, 101L, dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cannot modify auto-detected risks");
    }

    @Test
    void deleteRisk_throwsForAutoRisks() {
        when(riskRepository.findById(101L)).thenReturn(Optional.of(autoRisk));

        assertThatThrownBy(() -> riskService.deleteRisk(10L, 101L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cannot delete auto-detected risks");
    }

    @Test
    void computeRisks_createsSecurityRisk_whenObsolescenceBelow4() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        doNothing().when(authorizationService).checkAccessToProject(1L);

        MaturityKpi kpi = MaturityKpi.builder()
                .application(application)
                .obsolescence(3)
                .industrialization(5)
                .testing(5)
                .deployment(5)
                .build();
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));
        when(riskRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        List<RiskDTO> result = riskService.computeRisks(10L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getType()).isEqualTo(RiskType.SECURITY);
        assertThat(result.get(0).getSeverity()).isEqualTo(RiskSeverity.HIGH);
    }

    @Test
    void computeRisks_createsOperationalRisk_whenIndustrializationBelow3() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        doNothing().when(authorizationService).checkAccessToProject(1L);

        MaturityKpi kpi = MaturityKpi.builder()
                .application(application)
                .obsolescence(5)
                .industrialization(2)
                .testing(5)
                .deployment(5)
                .build();
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));
        when(riskRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        List<RiskDTO> result = riskService.computeRisks(10L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getType()).isEqualTo(RiskType.OPERATIONAL);
        assertThat(result.get(0).getSeverity()).isEqualTo(RiskSeverity.HIGH);
    }

    @Test
    void computeRisks_createsQualityRisk_whenTestingBelow3() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        doNothing().when(authorizationService).checkAccessToProject(1L);

        MaturityKpi kpi = MaturityKpi.builder()
                .application(application)
                .obsolescence(5)
                .industrialization(5)
                .testing(2)
                .deployment(5)
                .build();
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));
        when(riskRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        List<RiskDTO> result = riskService.computeRisks(10L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getType()).isEqualTo(RiskType.QUALITY);
        assertThat(result.get(0).getSeverity()).isEqualTo(RiskSeverity.MEDIUM);
    }

    @Test
    void computeRisks_createsAvailabilityRisk_whenDeploymentBelow3() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        doNothing().when(authorizationService).checkAccessToProject(1L);

        MaturityKpi kpi = MaturityKpi.builder()
                .application(application)
                .obsolescence(5)
                .industrialization(5)
                .testing(5)
                .deployment(2)
                .build();
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));
        when(riskRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        List<RiskDTO> result = riskService.computeRisks(10L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getType()).isEqualTo(RiskType.AVAILABILITY);
        assertThat(result.get(0).getSeverity()).isEqualTo(RiskSeverity.MEDIUM);
    }

    @Test
    void computeRisks_createsNoRisks_whenAllKpisGood() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        doNothing().when(authorizationService).checkAccessToProject(1L);

        MaturityKpi kpi = MaturityKpi.builder()
                .application(application)
                .obsolescence(8)
                .industrialization(7)
                .testing(6)
                .deployment(5)
                .build();
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));
        when(riskRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        List<RiskDTO> result = riskService.computeRisks(10L);

        assertThat(result).isEmpty();
    }

    @Test
    void computeRisks_deletesOldAutoRisks() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        doNothing().when(authorizationService).checkAccessToProject(1L);
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.empty());
        when(riskRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        riskService.computeRisks(10L);

        verify(riskRepository).deleteByApplicationIdAndSource(10L, RiskSource.AUTO);
    }
}
