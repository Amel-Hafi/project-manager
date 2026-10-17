package com.projectmonitor.service;

import com.projectmonitor.dto.RiskCreateDTO;
import com.projectmonitor.dto.RiskDTO;
import com.projectmonitor.dto.RiskUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.*;
import com.projectmonitor.repository.ApplicationRepository;
import com.projectmonitor.repository.MaturityKpiRepository;
import com.projectmonitor.repository.RiskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RiskService {

    private final RiskRepository riskRepository;
    private final ApplicationRepository applicationRepository;
    private final MaturityKpiRepository maturityKpiRepository;
    private final AuthorizationService authorizationService;

    public List<RiskDTO> getRisksByApplicationId(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        authorizationService.checkAccessToProject(app.getProject().getId());
        return riskRepository.findByApplicationId(applicationId).stream()
                .map(this::toDTO).toList();
    }

    public List<RiskDTO> getRisksByProjectId(Long projectId) {
        authorizationService.checkAccessToProject(projectId);
        return riskRepository.findByApplicationProjectId(projectId).stream()
                .map(this::toDTO).toList();
    }

    public RiskDTO createManualRisk(Long applicationId, RiskCreateDTO dto) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        authorizationService.checkAccessToProject(app.getProject().getId());

        Risk risk = Risk.builder()
                .application(app)
                .type(dto.getType())
                .source(RiskSource.MANUAL)
                .severity(dto.getSeverity())
                .description(dto.getDescription())
                .actionPlan(dto.getActionPlan())
                .resolved(false)
                .createdBy(authorizationService.getCurrentUser().getUsername())
                .build();
        return toDTO(riskRepository.save(risk));
    }

    public RiskDTO updateRisk(Long applicationId, Long riskId, RiskUpdateDTO dto) {
        Risk risk = riskRepository.findById(riskId)
                .orElseThrow(() -> new ResourceNotFoundException("Risk not found"));
        if (!risk.getApplication().getId().equals(applicationId)) {
            throw new ResourceNotFoundException("Risk not found");
        }
        if (risk.getSource() == RiskSource.AUTO) {
            throw new IllegalArgumentException("Cannot modify auto-detected risks");
        }
        authorizationService.checkAccessToProject(risk.getApplication().getProject().getId());

        if (dto.getSeverity() != null) risk.setSeverity(dto.getSeverity());
        if (dto.getDescription() != null) risk.setDescription(dto.getDescription());
        if (dto.getActionPlan() != null) risk.setActionPlan(dto.getActionPlan());
        if (dto.getResolved() != null) risk.setResolved(dto.getResolved());
        return toDTO(riskRepository.save(risk));
    }

    public void deleteRisk(Long applicationId, Long riskId) {
        Risk risk = riskRepository.findById(riskId)
                .orElseThrow(() -> new ResourceNotFoundException("Risk not found"));
        if (!risk.getApplication().getId().equals(applicationId)) {
            throw new ResourceNotFoundException("Risk not found");
        }
        if (risk.getSource() == RiskSource.AUTO) {
            throw new IllegalArgumentException("Cannot delete auto-detected risks");
        }
        authorizationService.checkAccessToProject(risk.getApplication().getProject().getId());
        riskRepository.delete(risk);
    }

    @Transactional
    public List<RiskDTO> computeRisks(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        authorizationService.checkAccessToProject(app.getProject().getId());

        riskRepository.deleteByApplicationIdAndSource(applicationId, RiskSource.AUTO);

        MaturityKpi kpi = maturityKpiRepository.findByApplicationId(applicationId).orElse(null);
        List<Risk> autoRisks = new ArrayList<>();

        if (kpi != null) {
            if (kpi.getObsolescence() != null && kpi.getObsolescence() < 4) {
                autoRisks.add(buildAutoRisk(app, RiskType.SECURITY, RiskSeverity.HIGH,
                        "Obsolescence KPI below threshold (" + kpi.getObsolescence() + "/10)"));
            }
            if (kpi.getIndustrialization() != null && kpi.getIndustrialization() < 3) {
                autoRisks.add(buildAutoRisk(app, RiskType.OPERATIONAL, RiskSeverity.HIGH,
                        "Industrialization KPI below threshold (" + kpi.getIndustrialization() + "/10)"));
            }
            if (kpi.getTesting() != null && kpi.getTesting() < 3) {
                autoRisks.add(buildAutoRisk(app, RiskType.QUALITY, RiskSeverity.MEDIUM,
                        "Testing KPI below threshold (" + kpi.getTesting() + "/10)"));
            }
            if (kpi.getDeployment() != null && kpi.getDeployment() < 3) {
                autoRisks.add(buildAutoRisk(app, RiskType.AVAILABILITY, RiskSeverity.MEDIUM,
                        "Deployment KPI below threshold (" + kpi.getDeployment() + "/10)"));
            }
        }

        List<Risk> saved = riskRepository.saveAll(autoRisks);
        return saved.stream().map(this::toDTO).toList();
    }

    private Risk buildAutoRisk(Application app, RiskType type, RiskSeverity severity, String description) {
        return Risk.builder()
                .application(app)
                .type(type)
                .source(RiskSource.AUTO)
                .severity(severity)
                .description(description)
                .resolved(false)
                .createdBy("SYSTEM")
                .build();
    }

    private RiskDTO toDTO(Risk risk) {
        return RiskDTO.builder()
                .id(risk.getId())
                .applicationId(risk.getApplication().getId())
                .applicationName(risk.getApplication().getName())
                .type(risk.getType())
                .source(risk.getSource())
                .severity(risk.getSeverity())
                .description(risk.getDescription())
                .actionPlan(risk.getActionPlan())
                .resolved(risk.getResolved())
                .createdBy(risk.getCreatedBy())
                .createdAt(risk.getCreatedAt())
                .updatedAt(risk.getUpdatedAt())
                .build();
    }
}
