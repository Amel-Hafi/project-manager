package com.projectmonitor.controller;

import com.projectmonitor.dto.ProjectCreateDTO;
import com.projectmonitor.dto.ProjectDTO;
import com.projectmonitor.dto.ProjectUpdateDTO;
import com.projectmonitor.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/clients/{clientId}/projects")
    @PreAuthorize("isAuthenticated()")
    public Page<ProjectDTO> getByClient(@PathVariable Long clientId, Pageable pageable) {
        return projectService.getByClient(clientId, pageable);
    }

    @PostMapping("/projects")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ProjectDTO create(@Valid @RequestBody ProjectCreateDTO dto) {
        return projectService.create(dto);
    }

    @PutMapping("/projects/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ProjectDTO update(@PathVariable Long id, @Valid @RequestBody ProjectUpdateDTO dto) {
        return projectService.update(id, dto);
    }

    @DeleteMapping("/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }
}
