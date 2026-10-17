package com.projectmonitor.service;

import com.projectmonitor.dto.ProjectCreateDTO;
import com.projectmonitor.dto.ProjectDTO;
import com.projectmonitor.dto.ProjectUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.Client;
import com.projectmonitor.model.Project;
import com.projectmonitor.repository.ClientRepository;
import com.projectmonitor.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private ProjectService projectService;

    private Client client;
    private Project project;

    @BeforeEach
    void setUp() {
        client = Client.builder()
                .id(1L)
                .name("Client")
                .build();

        project = Project.builder()
                .id(1L)
                .name("Project")
                .description("Desc")
                .client(client)
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getByClient_returnsPageOfProjects() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Project> page = new PageImpl<>(List.of(project), pageable, 1);
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(true);
        when(projectRepository.findByClientId(1L, pageable)).thenReturn(page);

        Page<ProjectDTO> result = projectService.getByClient(1L, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Project");
    }

    @Test
    void create_validDto_createsProject() {
        ProjectCreateDTO dto = new ProjectCreateDTO();
        dto.setName("New Project");
        dto.setDescription("Desc");
        dto.setClientId(1L);

        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        ProjectDTO result = projectService.create(dto);

        assertThat(result.getName()).isEqualTo("Project");
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void create_invalidClient_throwsException() {
        ProjectCreateDTO dto = new ProjectCreateDTO();
        dto.setName("New Project");
        dto.setClientId(99L);

        when(clientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.create(dto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void update_existingProject_updates() {
        ProjectUpdateDTO dto = new ProjectUpdateDTO();
        dto.setName("Updated");
        dto.setDescription("Updated desc");

        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        ProjectDTO result = projectService.update(1L, dto);

        assertThat(result).isNotNull();
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void delete_existingProject_softDeletes() {
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        projectService.delete(1L);

        assertThat(project.isDeleted()).isTrue();
        verify(projectRepository).save(project);
    }

    @Test
    void delete_nonExistingProject_throwsException() {
        when(authorizationService.hasAccessToProject(99L)).thenReturn(true);
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
