package com.projectmonitor.service;

import com.projectmonitor.dto.AiSuccessCaseCreateDTO;
import com.projectmonitor.dto.AiSuccessCaseDTO;
import com.projectmonitor.dto.AiSuccessCaseUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.AiCaseStatus;
import com.projectmonitor.model.AiSuccessCase;
import com.projectmonitor.model.Application;
import com.projectmonitor.repository.AiSuccessCaseRepository;
import com.projectmonitor.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiSuccessCaseService {

    private final AiSuccessCaseRepository aiSuccessCaseRepository;
    private final ApplicationRepository applicationRepository;
    private final AuthorizationService authorizationService;

    public List<AiSuccessCaseDTO> getByApplication(Long appId) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", appId));
        if (!authorizationService.hasAccessToProject(app.getProject().getId())) {
            throw new AccessDeniedException("No access to application's project");
        }
        return aiSuccessCaseRepository.findByApplicationId(appId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public AiSuccessCaseDTO create(Long appId, AiSuccessCaseCreateDTO dto) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", appId));
        if (!authorizationService.hasAccessToProject(app.getProject().getId())) {
            throw new AccessDeniedException("No access to application's project");
        }

        AiSuccessCase entity = AiSuccessCase.builder()
                .application(app)
                .title(dto.getTitle())
                .tool(dto.getTool())
                .profile(dto.getProfile())
                .description(dto.getDescription())
                .estimatedImpact(dto.getEstimatedImpact())
                .caseDate(dto.getCaseDate())
                .status(AiCaseStatus.PENDING)
                .build();

        return toDTO(aiSuccessCaseRepository.save(entity));
    }

    @Transactional
    public AiSuccessCaseDTO update(Long id, AiSuccessCaseUpdateDTO dto) {
        AiSuccessCase entity = aiSuccessCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AiSuccessCase", id));
        if (!authorizationService.hasAccessToProject(entity.getApplication().getProject().getId())) {
            throw new AccessDeniedException("No access to application's project");
        }
        if (entity.getStatus() != AiCaseStatus.PENDING) {
            throw new IllegalStateException("Cannot update a validated case");
        }

        if (dto.getTitle() != null && !dto.getTitle().isBlank()) entity.setTitle(dto.getTitle());
        if (dto.getTool() != null && !dto.getTool().isBlank()) entity.setTool(dto.getTool());
        if (dto.getProfile() != null && !dto.getProfile().isBlank()) entity.setProfile(dto.getProfile());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        if (dto.getEstimatedImpact() != null) entity.setEstimatedImpact(dto.getEstimatedImpact());
        if (dto.getCaseDate() != null) entity.setCaseDate(dto.getCaseDate());

        return toDTO(aiSuccessCaseRepository.save(entity));
    }

    @Transactional
    public AiSuccessCaseDTO validate(Long id) {
        AiSuccessCase entity = aiSuccessCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AiSuccessCase", id));
        if (!authorizationService.hasAccessToProject(entity.getApplication().getProject().getId())) {
            throw new AccessDeniedException("No access to application's project");
        }
        entity.setStatus(AiCaseStatus.VALIDATED);
        return toDTO(aiSuccessCaseRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        AiSuccessCase entity = aiSuccessCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AiSuccessCase", id));
        Application app = entity.getApplication();
        if (!authorizationService.hasAccessToProject(app.getProject().getId())) {
            throw new AccessDeniedException("No access to this project");
        }
        aiSuccessCaseRepository.delete(entity);
    }

    public List<AiSuccessCaseDTO> getAll(AiCaseStatus status) {
        if (authorizationService.hasUnrestrictedAccess()) {
            if (status != null) {
                return aiSuccessCaseRepository.findByStatus(status).stream()
                        .map(this::toDTO).toList();
            }
            return aiSuccessCaseRepository.findAll().stream()
                    .map(this::toDTO).toList();
        }
        List<Long> projectIds = authorizationService.getAssignedProjectIds();
        return projectIds.stream()
                .flatMap(pid -> aiSuccessCaseRepository.findByApplicationProjectId(pid).stream())
                .filter(c -> status == null || c.getStatus() == status)
                .map(this::toDTO)
                .toList();
    }

    private AiSuccessCaseDTO toDTO(AiSuccessCase entity) {
        return AiSuccessCaseDTO.builder()
                .id(entity.getId())
                .applicationId(entity.getApplication().getId())
                .applicationName(entity.getApplication().getName())
                .title(entity.getTitle())
                .tool(entity.getTool())
                .profile(entity.getProfile())
                .description(entity.getDescription())
                .estimatedImpact(entity.getEstimatedImpact())
                .caseDate(entity.getCaseDate())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
