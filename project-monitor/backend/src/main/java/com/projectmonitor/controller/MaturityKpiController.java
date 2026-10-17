package com.projectmonitor.controller;

import com.projectmonitor.dto.MaturityKpiDTO;
import com.projectmonitor.dto.MaturityKpiUpdateDTO;
import com.projectmonitor.dto.ProjectKpiSummaryDTO;
import com.projectmonitor.service.MaturityKpiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class MaturityKpiController {

    private final MaturityKpiService maturityKpiService;

    @GetMapping("/applications/{appId}/kpis")
    @PreAuthorize("isAuthenticated()")
    public MaturityKpiDTO getByApplication(@PathVariable Long appId) {
        return maturityKpiService.getByApplication(appId);
    }

    @PutMapping("/applications/{appId}/kpis")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    public MaturityKpiDTO updateKpis(@PathVariable Long appId, @Valid @RequestBody MaturityKpiUpdateDTO dto) {
        return maturityKpiService.createOrUpdate(appId, dto);
    }

    @GetMapping("/projects/{projectId}/kpis/summary")
    @PreAuthorize("isAuthenticated()")
    public ProjectKpiSummaryDTO getProjectSummary(@PathVariable Long projectId) {
        return maturityKpiService.getProjectSummary(projectId);
    }
}
