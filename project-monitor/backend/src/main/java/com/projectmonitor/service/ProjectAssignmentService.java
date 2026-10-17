package com.projectmonitor.service;

import com.projectmonitor.dto.ProjectAssignmentCreateDTO;
import com.projectmonitor.dto.ProjectAssignmentDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.AppUser;
import com.projectmonitor.model.Project;
import com.projectmonitor.model.ProjectAssignment;
import com.projectmonitor.repository.AppUserRepository;
import com.projectmonitor.repository.ProjectAssignmentRepository;
import com.projectmonitor.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectAssignmentService {

    private final ProjectAssignmentRepository assignmentRepository;
    private final AppUserRepository userRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public ProjectAssignmentDTO create(ProjectAssignmentCreateDTO dto) {
        AppUser user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("AppUser", dto.getUserId()));
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", dto.getProjectId()));

        ProjectAssignment assignment = ProjectAssignment.builder()
                .user(user)
                .project(project)
                .role(dto.getRole())
                .build();

        return toDTO(assignmentRepository.save(assignment));
    }

    public java.util.List<ProjectAssignmentDTO> getByProjectId(Long projectId) {
        return assignmentRepository.findByProjectId(projectId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("ProjectAssignment", id);
        }
        assignmentRepository.deleteById(id);
    }

    private ProjectAssignmentDTO toDTO(ProjectAssignment entity) {
        return ProjectAssignmentDTO.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .username(entity.getUser().getUsername())
                .projectId(entity.getProject().getId())
                .projectName(entity.getProject().getName())
                .role(entity.getRole())
                .build();
    }
}
