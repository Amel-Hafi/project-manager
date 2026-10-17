package com.projectmonitor.service;

import com.projectmonitor.model.AppUser;
import com.projectmonitor.model.ProjectAssignment;
import com.projectmonitor.model.enums.UserRole;
import com.projectmonitor.repository.AppUserRepository;
import com.projectmonitor.repository.ProjectAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthorizationService {

    private final AppUserRepository appUserRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;

    /**
     * Returns the currently authenticated AppUser from the SecurityContext.
     */
    public AppUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    /**
     * Returns true if the current user has unrestricted access (ADMIN or DIRECTOR).
     */
    public boolean hasUnrestrictedAccess() {
        AppUser user = getCurrentUser();
        return user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.DIRECTOR;
    }

    /**
     * Returns true if the current user has access to the specified project.
     * ADMIN and DIRECTOR always have access.
     * MANAGER and DT_REFERENT only have access if assigned to the project.
     */
    public boolean hasAccessToProject(Long projectId) {
        AppUser user = getCurrentUser();
        if (user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.DIRECTOR) {
            return true;
        }
        return projectAssignmentRepository.existsByUserIdAndProjectId(user.getId(), projectId);
    }

    /**
     * Throws AccessDeniedException if the current user does not have access to the project.
     */
    public void checkAccessToProject(Long projectId) {
        if (!hasAccessToProject(projectId)) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied to project " + projectId);
        }
    }

    /**
     * Returns the list of project IDs assigned to the current user.
     * For ADMIN/DIRECTOR, returns empty list (they should use unfiltered queries).
     */
    public List<Long> getAssignedProjectIds() {
        AppUser user = getCurrentUser();
        return projectAssignmentRepository.findByUserId(user.getId()).stream()
                .map(assignment -> assignment.getProject().getId())
                .toList();
    }
}
