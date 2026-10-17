package com.projectmonitor.service;

import com.projectmonitor.model.AppUser;
import com.projectmonitor.model.Project;
import com.projectmonitor.model.ProjectAssignment;
import com.projectmonitor.model.enums.AssignmentRole;
import com.projectmonitor.model.enums.UserRole;
import com.projectmonitor.repository.AppUserRepository;
import com.projectmonitor.repository.ProjectAssignmentRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthorizationServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private ProjectAssignmentRepository projectAssignmentRepository;

    @InjectMocks
    private AuthorizationService authorizationService;

    private AppUser adminUser;
    private AppUser directorUser;
    private AppUser managerUser;
    private AppUser dtReferentUser;

    @BeforeEach
    void setUp() {
        adminUser = AppUser.builder().id(1L).username("admin").role(UserRole.ADMIN).build();
        directorUser = AppUser.builder().id(2L).username("director").role(UserRole.DIRECTOR).build();
        managerUser = AppUser.builder().id(3L).username("manager").role(UserRole.MANAGER).build();
        dtReferentUser = AppUser.builder().id(4L).username("dtreferent").role(UserRole.DT_REFERENT).build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void setAuthenticatedUser(String username) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList()));
        SecurityContextHolder.setContext(context);
    }

    @Test
    void getCurrentUser_shouldReturnUser() {
        setAuthenticatedUser("admin");
        when(appUserRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));

        AppUser result = authorizationService.getCurrentUser();

        assertThat(result).isEqualTo(adminUser);
    }

    @Test
    void hasUnrestrictedAccess_shouldReturnTrueForAdmin() {
        setAuthenticatedUser("admin");
        when(appUserRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));

        assertThat(authorizationService.hasUnrestrictedAccess()).isTrue();
    }

    @Test
    void hasUnrestrictedAccess_shouldReturnTrueForDirector() {
        setAuthenticatedUser("director");
        when(appUserRepository.findByUsername("director")).thenReturn(Optional.of(directorUser));

        assertThat(authorizationService.hasUnrestrictedAccess()).isTrue();
    }

    @Test
    void hasUnrestrictedAccess_shouldReturnFalseForManager() {
        setAuthenticatedUser("manager");
        when(appUserRepository.findByUsername("manager")).thenReturn(Optional.of(managerUser));

        assertThat(authorizationService.hasUnrestrictedAccess()).isFalse();
    }

    @Test
    void hasUnrestrictedAccess_shouldReturnFalseForDtReferent() {
        setAuthenticatedUser("dtreferent");
        when(appUserRepository.findByUsername("dtreferent")).thenReturn(Optional.of(dtReferentUser));

        assertThat(authorizationService.hasUnrestrictedAccess()).isFalse();
    }

    @Test
    void hasAccessToProject_shouldReturnTrueForAdmin() {
        setAuthenticatedUser("admin");
        when(appUserRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));

        assertThat(authorizationService.hasAccessToProject(1L)).isTrue();
    }

    @Test
    void hasAccessToProject_shouldReturnTrueForAssignedManager() {
        setAuthenticatedUser("manager");
        when(appUserRepository.findByUsername("manager")).thenReturn(Optional.of(managerUser));
        when(projectAssignmentRepository.existsByUserIdAndProjectId(3L, 10L)).thenReturn(true);

        assertThat(authorizationService.hasAccessToProject(10L)).isTrue();
    }

    @Test
    void hasAccessToProject_shouldReturnFalseForUnassignedManager() {
        setAuthenticatedUser("manager");
        when(appUserRepository.findByUsername("manager")).thenReturn(Optional.of(managerUser));
        when(projectAssignmentRepository.existsByUserIdAndProjectId(3L, 99L)).thenReturn(false);

        assertThat(authorizationService.hasAccessToProject(99L)).isFalse();
    }

    @Test
    void hasAccessToProject_shouldReturnTrueForAssignedDtReferent() {
        setAuthenticatedUser("dtreferent");
        when(appUserRepository.findByUsername("dtreferent")).thenReturn(Optional.of(dtReferentUser));
        when(projectAssignmentRepository.existsByUserIdAndProjectId(4L, 5L)).thenReturn(true);

        assertThat(authorizationService.hasAccessToProject(5L)).isTrue();
    }

    @Test
    void getAssignedProjectIds_shouldReturnProjectIds() {
        setAuthenticatedUser("manager");
        when(appUserRepository.findByUsername("manager")).thenReturn(Optional.of(managerUser));

        Project project1 = Project.builder().id(10L).build();
        Project project2 = Project.builder().id(20L).build();
        List<ProjectAssignment> assignments = List.of(
                ProjectAssignment.builder().id(1L).user(managerUser).project(project1).role(AssignmentRole.MANAGER).build(),
                ProjectAssignment.builder().id(2L).user(managerUser).project(project2).role(AssignmentRole.MANAGER).build()
        );
        when(projectAssignmentRepository.findByUserId(3L)).thenReturn(assignments);

        List<Long> result = authorizationService.getAssignedProjectIds();

        assertThat(result).containsExactlyInAnyOrder(10L, 20L);
    }

    @Test
    void getAssignedProjectIds_shouldReturnEmptyListWhenNoAssignments() {
        setAuthenticatedUser("manager");
        when(appUserRepository.findByUsername("manager")).thenReturn(Optional.of(managerUser));
        when(projectAssignmentRepository.findByUserId(3L)).thenReturn(Collections.emptyList());

        List<Long> result = authorizationService.getAssignedProjectIds();

        assertThat(result).isEmpty();
    }
}
