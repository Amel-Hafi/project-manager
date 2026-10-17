package com.projectmonitor.controller;

import com.projectmonitor.dto.ApplicationCreateDTO;
import com.projectmonitor.dto.ApplicationDTO;
import com.projectmonitor.dto.ApplicationUpdateDTO;
import com.projectmonitor.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping("/applications/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApplicationDTO getById(@PathVariable Long id) {
        return applicationService.getById(id);
    }

    @GetMapping("/projects/{projectId}/applications")
    @PreAuthorize("isAuthenticated()")
    public Page<ApplicationDTO> getByProject(@PathVariable Long projectId, Pageable pageable) {
        return applicationService.getByProject(projectId, pageable);
    }

    @PostMapping("/applications")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    public ApplicationDTO create(@Valid @RequestBody ApplicationCreateDTO dto) {
        return applicationService.create(dto);
    }

    @PutMapping("/applications/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    public ApplicationDTO update(@PathVariable Long id, @Valid @RequestBody ApplicationUpdateDTO dto) {
        return applicationService.update(id, dto);
    }

    @DeleteMapping("/applications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    public void delete(@PathVariable Long id) {
        applicationService.delete(id);
    }

    @PutMapping("/applications/{id}/technologies")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    public ApplicationDTO updateTechnologies(@PathVariable Long id, @RequestBody List<Long> technologyIds) {
        return applicationService.updateTechnologies(id, technologyIds);
    }
}
