package com.projectmonitor.controller;

import com.projectmonitor.dto.ProjectAssignmentCreateDTO;
import com.projectmonitor.dto.ProjectAssignmentDTO;
import com.projectmonitor.service.ProjectAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/project-assignments")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class ProjectAssignmentController {

    private final ProjectAssignmentService assignmentService;

    @GetMapping("/by-project/{projectId}")
    @PreAuthorize("isAuthenticated()")
    public java.util.List<ProjectAssignmentDTO> getByProject(@PathVariable Long projectId) {
        return assignmentService.getByProjectId(projectId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectAssignmentDTO create(@Valid @RequestBody ProjectAssignmentCreateDTO dto) {
        return assignmentService.create(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        assignmentService.delete(id);
    }
}
