package com.projectmonitor.service;

import com.projectmonitor.dto.ApplicationCreateDTO;
import com.projectmonitor.dto.ApplicationDTO;
import com.projectmonitor.dto.ApplicationUpdateDTO;
import com.projectmonitor.dto.TechnologyItemDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.Application;
import com.projectmonitor.model.Project;
import com.projectmonitor.model.TechnologyItem;
import com.projectmonitor.model.enums.ApplicationStatus;
import com.projectmonitor.repository.ApplicationRepository;
import com.projectmonitor.repository.ProjectRepository;
import com.projectmonitor.repository.TechnologyItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;
    private final TechnologyItemRepository technologyItemRepository;
    private final TechnologyService technologyService;
    private final AuthorizationService authorizationService;

    public ApplicationDTO getById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));
        if (!authorizationService.hasAccessToProject(app.getProject().getId())) {
            throw new AccessDeniedException("No access to project " + app.getProject().getId());
        }
        return toDTO(app);
    }

    public Page<ApplicationDTO> getByProject(Long projectId, Pageable pageable) {
        if (!authorizationService.hasAccessToProject(projectId)) {
            throw new AccessDeniedException("No access to project " + projectId);
        }
        return applicationRepository.findByProjectId(projectId, pageable).map(this::toDTO);
    }

    @Transactional
    public ApplicationDTO create(ApplicationCreateDTO dto) {
        if (!authorizationService.hasAccessToProject(dto.getProjectId())) {
            throw new AccessDeniedException("No access to project " + dto.getProjectId());
        }
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", dto.getProjectId()));

        Application app = Application.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .status(dto.getStatus() != null ? dto.getStatus() : ApplicationStatus.ACTIVE)
                .project(project)
                .repositoryUrls(dto.getRepositoryUrls() != null ? dto.getRepositoryUrls() : new ArrayList<>())
                .lastProductionDeploymentDate(dto.getLastProductionDeploymentDate())
                .activeCriticalCves(dto.getActiveCriticalCves() != null ? dto.getActiveCriticalCves() : 0)
                .technicalDocUpToDate(dto.getTechnicalDocUpToDate() != null ? dto.getTechnicalDocUpToDate() : false)
                .build();

        if (dto.getTechnologyIds() != null && !dto.getTechnologyIds().isEmpty()) {
            Set<TechnologyItem> techs = new HashSet<>(technologyItemRepository.findAllById(dto.getTechnologyIds()));
            app.setTechnologies(techs);
        }

        return toDTO(applicationRepository.save(app));
    }

    @Transactional
    public ApplicationDTO update(Long id, ApplicationUpdateDTO dto) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));
        if (!authorizationService.hasAccessToProject(app.getProject().getId())) {
            throw new AccessDeniedException("No access to project " + app.getProject().getId());
        }

        app.setName(dto.getName());
        app.setDescription(dto.getDescription());
        app.setStartDate(dto.getStartDate());
        if (dto.getStatus() != null) {
            app.setStatus(dto.getStatus());
        }
        if (dto.getProjectId() != null) {
            if (!authorizationService.hasAccessToProject(dto.getProjectId())) {
                throw new AccessDeniedException("No access to target project " + dto.getProjectId());
            }
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", dto.getProjectId()));
            app.setProject(project);
        }
        if (dto.getRepositoryUrls() != null) {
            app.setRepositoryUrls(dto.getRepositoryUrls());
        }
        if (dto.getLastProductionDeploymentDate() != null) {
            app.setLastProductionDeploymentDate(dto.getLastProductionDeploymentDate());
        }
        if (dto.getActiveCriticalCves() != null) {
            app.setActiveCriticalCves(dto.getActiveCriticalCves());
        }
        if (dto.getTechnicalDocUpToDate() != null) {
            app.setTechnicalDocUpToDate(dto.getTechnicalDocUpToDate());
        }

        return toDTO(applicationRepository.save(app));
    }

    @Transactional
    public void delete(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));
        if (!authorizationService.hasAccessToProject(app.getProject().getId())) {
            throw new AccessDeniedException("No access to project " + app.getProject().getId());
        }
        app.setDeleted(true);
        applicationRepository.save(app);
    }

    @Transactional
    public ApplicationDTO updateTechnologies(Long id, List<Long> technologyIds) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));
        if (!authorizationService.hasAccessToProject(app.getProject().getId())) {
            throw new AccessDeniedException("No access to project " + app.getProject().getId());
        }

        Set<TechnologyItem> techs = new HashSet<>(technologyItemRepository.findAllById(technologyIds));
        app.setTechnologies(techs);

        return toDTO(applicationRepository.save(app));
    }

    private ApplicationDTO toDTO(Application entity) {
        List<TechnologyItemDTO> techDTOs = entity.getTechnologies().stream()
                .map(technologyService::toItemDTO)
                .toList();

        return ApplicationDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .startDate(entity.getStartDate())
                .status(entity.getStatus())
                .projectId(entity.getProject().getId())
                .projectName(entity.getProject().getName())
                .technologies(techDTOs)
                .repositoryUrls(entity.getRepositoryUrls())
                .lastProductionDeploymentDate(entity.getLastProductionDeploymentDate())
                .activeCriticalCves(entity.getActiveCriticalCves())
                .technicalDocUpToDate(entity.getTechnicalDocUpToDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
