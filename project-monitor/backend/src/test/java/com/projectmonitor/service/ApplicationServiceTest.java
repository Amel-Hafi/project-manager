package com.projectmonitor.service;

import com.projectmonitor.dto.ApplicationCreateDTO;
import com.projectmonitor.dto.ApplicationDTO;
import com.projectmonitor.dto.ApplicationUpdateDTO;
import com.projectmonitor.dto.TechnologyItemDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.Application;
import com.projectmonitor.model.Client;
import com.projectmonitor.model.Project;
import com.projectmonitor.model.TechnologyCategory;
import com.projectmonitor.model.TechnologyItem;
import com.projectmonitor.model.enums.ApplicationStatus;
import com.projectmonitor.model.enums.TechnologyCategoryCode;
import com.projectmonitor.model.enums.TechnologyStatus;
import com.projectmonitor.repository.ApplicationRepository;
import com.projectmonitor.repository.ProjectRepository;
import com.projectmonitor.repository.TechnologyItemRepository;
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
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TechnologyItemRepository technologyItemRepository;

    @Mock
    private TechnologyService technologyService;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private ApplicationService applicationService;

    private Project project;
    private Application application;
    private TechnologyItem techItem;
    private TechnologyCategory category;

    @BeforeEach
    void setUp() {
        Client client = Client.builder().id(1L).name("Client").build();
        project = Project.builder().id(1L).name("Project").client(client).build();

        category = TechnologyCategory.builder()
                .id(1L)
                .code(TechnologyCategoryCode.PROJECT_TECH)
                .name("Technologies Projet")
                .build();

        techItem = TechnologyItem.builder()
                .id(1L)
                .name("Java")
                .version("21")
                .status(TechnologyStatus.ACTIVE)
                .category(category)
                .build();

        application = Application.builder()
                .id(1L)
                .name("App")
                .description("Desc")
                .status(ApplicationStatus.ACTIVE)
                .project(project)
                .technologies(new HashSet<>(Set.of(techItem)))
                .repositoryUrls(new ArrayList<>(List.of("https://github.com/test")))
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getByProject_returnsPage() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Application> page = new PageImpl<>(List.of(application), pageable, 1);
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(applicationRepository.findByProjectId(1L, pageable)).thenReturn(page);
        when(technologyService.toItemDTO(any(TechnologyItem.class))).thenReturn(
                TechnologyItemDTO.builder().id(1L).name("Java").build());

        Page<ApplicationDTO> result = applicationService.getByProject(1L, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("App");
    }

    @Test
    void create_validDto_createsApplication() {
        ApplicationCreateDTO dto = new ApplicationCreateDTO();
        dto.setName("New App");
        dto.setProjectId(1L);
        dto.setTechnologyIds(List.of(1L));

        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(technologyItemRepository.findAllById(List.of(1L))).thenReturn(List.of(techItem));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);
        when(technologyService.toItemDTO(any(TechnologyItem.class))).thenReturn(
                TechnologyItemDTO.builder().id(1L).name("Java").build());

        ApplicationDTO result = applicationService.create(dto);

        assertThat(result.getName()).isEqualTo("App");
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    void create_invalidProject_throwsException() {
        ApplicationCreateDTO dto = new ApplicationCreateDTO();
        dto.setName("New App");
        dto.setProjectId(99L);

        when(authorizationService.hasAccessToProject(99L)).thenReturn(true);
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applicationService.create(dto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void delete_existingApplication_softDeletes() {
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        applicationService.delete(1L);

        assertThat(application.isDeleted()).isTrue();
        verify(applicationRepository).save(application);
    }

    @Test
    void delete_nonExistingApplication_throwsException() {
        when(applicationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applicationService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateTechnologies_replacesAssociations() {
        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(technologyItemRepository.findAllById(anyList())).thenReturn(List.of(techItem));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);
        when(technologyService.toItemDTO(any(TechnologyItem.class))).thenReturn(
                TechnologyItemDTO.builder().id(1L).name("Java").build());

        ApplicationDTO result = applicationService.updateTechnologies(1L, List.of(1L));

        assertThat(result).isNotNull();
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    void toDTO_mapsAdditionalKpiFields() {
        application.setLastProductionDeploymentDate(java.time.LocalDate.of(2026, 1, 15));
        application.setActiveCriticalCves(3);
        application.setTechnicalDocUpToDate(true);

        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(applicationRepository.findByProjectId(eq(1L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(application)));
        when(technologyService.toItemDTO(any(TechnologyItem.class))).thenReturn(
                TechnologyItemDTO.builder().id(1L).name("Java").build());

        Page<ApplicationDTO> result = applicationService.getByProject(1L, PageRequest.of(0, 20));

        ApplicationDTO dto = result.getContent().get(0);
        assertThat(dto.getLastProductionDeploymentDate()).isEqualTo(java.time.LocalDate.of(2026, 1, 15));
        assertThat(dto.getActiveCriticalCves()).isEqualTo(3);
        assertThat(dto.getTechnicalDocUpToDate()).isTrue();
    }

    @Test
    void update_mapsAdditionalKpiFields() {
        ApplicationUpdateDTO updateDto = new ApplicationUpdateDTO();
        updateDto.setName("Updated App");
        updateDto.setLastProductionDeploymentDate(java.time.LocalDate.of(2026, 3, 20));
        updateDto.setActiveCriticalCves(5);
        updateDto.setTechnicalDocUpToDate(true);

        when(authorizationService.hasAccessToProject(1L)).thenReturn(true);
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenAnswer(inv -> inv.getArgument(0));
        when(technologyService.toItemDTO(any(TechnologyItem.class))).thenReturn(
                TechnologyItemDTO.builder().id(1L).name("Java").build());

        ApplicationDTO result = applicationService.update(1L, updateDto);

        assertThat(application.getLastProductionDeploymentDate()).isEqualTo(java.time.LocalDate.of(2026, 3, 20));
        assertThat(application.getActiveCriticalCves()).isEqualTo(5);
        assertThat(application.getTechnicalDocUpToDate()).isTrue();
    }
}
