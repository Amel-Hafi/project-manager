package com.projectmonitor.controller;

import com.projectmonitor.dto.ClientKpiSummaryDTO;
import com.projectmonitor.dto.GlobalDashboardDTO;
import com.projectmonitor.dto.ReferentWorkloadDTO;
import com.projectmonitor.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/clients/{clientId}")
    @PreAuthorize("isAuthenticated()")
    public ClientKpiSummaryDTO getClientSummary(@PathVariable Long clientId) {
        return dashboardService.getClientSummary(clientId);
    }

    @GetMapping("/global")
    @PreAuthorize("isAuthenticated()")
    public GlobalDashboardDTO getGlobalDashboard() {
        return dashboardService.getGlobalDashboard();
    }

    @GetMapping("/referent-workload")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public List<ReferentWorkloadDTO> getReferentWorkload() {
        return dashboardService.getReferentWorkload();
    }
}
