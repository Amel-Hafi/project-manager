package com.projectmonitor.service;

import com.projectmonitor.dto.AiSuccessCaseCreateDTO;
import com.projectmonitor.dto.AiSuccessCaseDTO;
import com.projectmonitor.dto.AiSuccessCaseUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.AiCaseStatus;
import com.projectmonitor.model.AiSuccessCase;
import com.projectmonitor.model.Application;
import com.projectmonitor.model.Project;
import com.projectmonitor.repository.AiSuccessCaseRepository;
import com.projectmonitor.repository.ApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiSuccessCaseServiceTest {

    @Mock
    private AiSuccessCaseRepository aiSuccessCaseRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private AiSuccessCaseService aiSuccessCaseService;

    private Project project;
    private Application application;
    private AiSuccessCase aiSuccessCase;

    @BeforeEach
    void setUp() {
        project = Project.builder().id(1L).name("Project").build();
        application = Application.builder().id(10L).name("App").project(project).build();
        aiSuccessCase = AiSuccessCase.builder()
                .id(100L)
                .application(application)
                .title("AI Case")
                .tool("Copilot")
                .profile("Developer")
                .description("Description")
                .estimatedImpact("High")
                .caseDate(LocalDate.of(2026, 1, 15))
                .status(AiCaseStatus.PENDING)
                .build();
    }

    @Test
    void getByApplication_returnsCase() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(aiSuccessCaseRepository.findByApplicationId(10L)).thenReturn(List.of(aiSuccessCase));

        List<AiSuccessCaseDTO> result = aiSuccessCaseService.getByApplication(10L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("AI Case");
        assertThat(result.get(0).getApplicationId()).isEqualTo(10L);
    }

    @Test
    void getByApplication_throwsWhenNoAccess() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(false);

        assertThatThrownBy(() -> aiSuccessCaseService.getByApplication(10L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void getByApplication_throwsWhenAppNotFound() {
        when(applicationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> aiSuccessCaseService.getByApplication(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_setsPendingStatus() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(aiSuccessCaseRepository.save(any(AiSuccessCase.class))).thenReturn(aiSuccessCase);

        AiSuccessCaseCreateDTO dto = new AiSuccessCaseCreateDTO();
        dto.setTitle("AI Case");
        dto.setTool("Copilot");
        dto.setProfile("Developer");

        AiSuccessCaseDTO result = aiSuccessCaseService.create(10L, dto);

        assertThat(result.getStatus()).isEqualTo(AiCaseStatus.PENDING);
        verify(aiSuccessCaseRepository).save(argThat(e -> e.getStatus() == AiCaseStatus.PENDING));
    }

    @Test
    void create_throwsWhenNoAccess() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(false);

        AiSuccessCaseCreateDTO dto = new AiSuccessCaseCreateDTO();
        dto.setTitle("AI Case");
        dto.setTool("Copilot");
        dto.setProfile("Developer");

        assertThatThrownBy(() -> aiSuccessCaseService.create(10L, dto))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void update_worksWhenPending() {
        when(aiSuccessCaseRepository.findById(100L)).thenReturn(Optional.of(aiSuccessCase));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(aiSuccessCaseRepository.save(any(AiSuccessCase.class))).thenReturn(aiSuccessCase);

        AiSuccessCaseUpdateDTO dto = new AiSuccessCaseUpdateDTO();
        dto.setTitle("Updated Title");

        AiSuccessCaseDTO result = aiSuccessCaseService.update(100L, dto);

        assertThat(result).isNotNull();
        verify(aiSuccessCaseRepository).save(any(AiSuccessCase.class));
    }

    @Test
    void update_throwsWhenValidated() {
        aiSuccessCase.setStatus(AiCaseStatus.VALIDATED);
        when(aiSuccessCaseRepository.findById(100L)).thenReturn(Optional.of(aiSuccessCase));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);

        AiSuccessCaseUpdateDTO dto = new AiSuccessCaseUpdateDTO();
        dto.setTitle("Updated Title");

        assertThatThrownBy(() -> aiSuccessCaseService.update(100L, dto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot update a validated case");
    }

    @Test
    void update_throwsWhenNoAccess() {
        when(aiSuccessCaseRepository.findById(100L)).thenReturn(Optional.of(aiSuccessCase));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(false);

        AiSuccessCaseUpdateDTO dto = new AiSuccessCaseUpdateDTO();

        assertThatThrownBy(() -> aiSuccessCaseService.update(100L, dto))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void validate_changesStatusToValidated() {
        when(aiSuccessCaseRepository.findById(100L)).thenReturn(Optional.of(aiSuccessCase));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);

        AiSuccessCase validated = AiSuccessCase.builder()
                .id(100L).application(application).title("AI Case").tool("Copilot")
                .profile("Developer").status(AiCaseStatus.VALIDATED).build();
        when(aiSuccessCaseRepository.save(any(AiSuccessCase.class))).thenReturn(validated);

        AiSuccessCaseDTO result = aiSuccessCaseService.validate(100L);

        assertThat(result.getStatus()).isEqualTo(AiCaseStatus.VALIDATED);
    }

    @Test
    void validate_throwsWhenNoAccess() {
        when(aiSuccessCaseRepository.findById(100L)).thenReturn(Optional.of(aiSuccessCase));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(false);

        assertThatThrownBy(() -> aiSuccessCaseService.validate(100L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void delete_removesEntity() {
        when(aiSuccessCaseRepository.findById(100L)).thenReturn(Optional.of(aiSuccessCase));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);

        aiSuccessCaseService.delete(100L);

        verify(aiSuccessCaseRepository).delete(aiSuccessCase);
    }

    @Test
    void delete_throwsWhenNoAccess() {
        when(aiSuccessCaseRepository.findById(100L)).thenReturn(Optional.of(aiSuccessCase));
        when(authorizationService.hasAccessToProject(1L)).thenReturn(false);

        assertThatThrownBy(() -> aiSuccessCaseService.delete(100L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void delete_throwsWhenNotFound() {
        when(aiSuccessCaseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> aiSuccessCaseService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getAll_unrestrictedAccess_returnsAll() {
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(true);
        when(aiSuccessCaseRepository.findAll()).thenReturn(List.of(aiSuccessCase));

        List<AiSuccessCaseDTO> result = aiSuccessCaseService.getAll(null);

        assertThat(result).hasSize(1);
    }

    @Test
    void getAll_unrestrictedAccess_filtersByStatus() {
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(true);
        when(aiSuccessCaseRepository.findByStatus(AiCaseStatus.PENDING)).thenReturn(List.of(aiSuccessCase));

        List<AiSuccessCaseDTO> result = aiSuccessCaseService.getAll(AiCaseStatus.PENDING);

        assertThat(result).hasSize(1);
    }

    @Test
    void getAll_restrictedAccess_filtersByProjects() {
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(false);
        when(authorizationService.getAssignedProjectIds()).thenReturn(List.of(1L));
        when(aiSuccessCaseRepository.findByApplicationProjectId(1L)).thenReturn(List.of(aiSuccessCase));

        List<AiSuccessCaseDTO> result = aiSuccessCaseService.getAll(null);

        assertThat(result).hasSize(1);
    }
}
