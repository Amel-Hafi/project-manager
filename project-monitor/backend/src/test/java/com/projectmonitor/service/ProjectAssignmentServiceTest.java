package com.projectmonitor.service;

import com.projectmonitor.dto.ProjectAssignmentCreateDTO;
import com.projectmonitor.dto.ProjectAssignmentDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.AppUser;
import com.projectmonitor.model.Client;
import com.projectmonitor.model.Project;
import com.projectmonitor.model.ProjectAssignment;
import com.projectmonitor.model.enums.AssignmentRole;
import com.projectmonitor.model.enums.UserRole;
import com.projectmonitor.repository.AppUserRepository;
import com.projectmonitor.repository.ProjectAssignmentRepository;
import com.projectmonitor.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectAssignmentServiceTest {

    @Mock
    private ProjectAssignmentRepository assignmentRepository;

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectAssignmentService assignmentService;

    private AppUser user;
    private Project project;
    private ProjectAssignment assignment;

    @BeforeEach
    void setUp() {
        user = AppUser.builder()
                .id(1L)
                .username("jdoe")
                .role(UserRole.MANAGER)
                .build();

        Client client = Client.builder().id(1L).name("Client").build();
        project = Project.builder()
                .id(1L)
                .name("Project Alpha")
                .client(client)
                .build();

        assignment = ProjectAssignment.builder()
                .id(1L)
                .user(user)
                .project(project)
                .role(AssignmentRole.MANAGER)
                .build();
    }

    @Test
    void create_success() {
        ProjectAssignmentCreateDTO dto = new ProjectAssignmentCreateDTO();
        dto.setUserId(1L);
        dto.setProjectId(1L);
        dto.setRole(AssignmentRole.MANAGER);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(assignmentRepository.save(any(ProjectAssignment.class))).thenReturn(assignment);

        ProjectAssignmentDTO result = assignmentService.create(dto);

        assertThat(result.getUserId()).isEqualTo(1L);
        assertThat(result.getProjectId()).isEqualTo(1L);
        assertThat(result.getRole()).isEqualTo(AssignmentRole.MANAGER);
        assertThat(result.getUsername()).isEqualTo("jdoe");
        assertThat(result.getProjectName()).isEqualTo("Project Alpha");
        verify(assignmentRepository).save(any(ProjectAssignment.class));
    }

    @Test
    void create_userNotFound_throws() {
        ProjectAssignmentCreateDTO dto = new ProjectAssignmentCreateDTO();
        dto.setUserId(99L);
        dto.setProjectId(1L);
        dto.setRole(AssignmentRole.MANAGER);

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assignmentService.create(dto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_projectNotFound_throws() {
        ProjectAssignmentCreateDTO dto = new ProjectAssignmentCreateDTO();
        dto.setUserId(1L);
        dto.setProjectId(99L);
        dto.setRole(AssignmentRole.MANAGER);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assignmentService.create(dto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void delete_success() {
        when(assignmentRepository.existsById(1L)).thenReturn(true);

        assignmentService.delete(1L);

        verify(assignmentRepository).deleteById(1L);
    }

    @Test
    void delete_notFound_throws() {
        when(assignmentRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> assignmentService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
