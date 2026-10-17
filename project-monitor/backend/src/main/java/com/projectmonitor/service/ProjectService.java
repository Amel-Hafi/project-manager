package com.projectmonitor.service;

import com.projectmonitor.dto.ProjectCreateDTO;
import com.projectmonitor.dto.ProjectDTO;
import com.projectmonitor.dto.ProjectUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.Client;
import com.projectmonitor.model.Project;
import com.projectmonitor.repository.ClientRepository;
import com.projectmonitor.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ClientRepository clientRepository;
    private final AuthorizationService authorizationService;

    public Page<ProjectDTO> getByClient(Long clientId, Pageable pageable) {
        if (authorizationService.hasUnrestrictedAccess()) {
            return projectRepository.findByClientId(clientId, pageable).map(this::toDTO);
        }
        List<Long> projectIds = authorizationService.getAssignedProjectIds();
        if (projectIds.isEmpty()) {
            return Page.empty(pageable);
        }
        return projectRepository.findByClientIdAndIdIn(clientId, projectIds, pageable).map(this::toDTO);
    }

    @Transactional
    public ProjectDTO create(ProjectCreateDTO dto) {
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client", dto.getClientId()));

        Project project = Project.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .client(client)
                .build();

        return toDTO(projectRepository.save(project));
    }

    @Transactional
    public ProjectDTO update(Long id, ProjectUpdateDTO dto) {
        if (!authorizationService.hasAccessToProject(id)) {
            throw new AccessDeniedException("No access to project " + id);
        }
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));

        project.setName(dto.getName());
        project.setDescription(dto.getDescription());

        if (dto.getClientId() != null) {
            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Client", dto.getClientId()));
            project.setClient(client);
        }

        return toDTO(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id) {
        if (!authorizationService.hasAccessToProject(id)) {
            throw new AccessDeniedException("No access to project " + id);
        }
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        project.setDeleted(true);
        projectRepository.save(project);
    }

    private ProjectDTO toDTO(Project entity) {
        return ProjectDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .clientId(entity.getClient().getId())
                .clientName(entity.getClient().getName())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
