package com.projectmonitor.controller;

import com.projectmonitor.dto.RiskCreateDTO;
import com.projectmonitor.dto.RiskDTO;
import com.projectmonitor.dto.RiskUpdateDTO;
import com.projectmonitor.service.RiskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RiskController {

    private final RiskService riskService;

    @GetMapping("/applications/{appId}/risks")
    @PreAuthorize("isAuthenticated()")
    public List<RiskDTO> getApplicationRisks(@PathVariable Long appId) {
        return riskService.getRisksByApplicationId(appId);
    }

    @GetMapping("/projects/{projectId}/risks")
    @PreAuthorize("isAuthenticated()")
    public List<RiskDTO> getProjectRisks(@PathVariable Long projectId) {
        return riskService.getRisksByProjectId(projectId);
    }

    @PostMapping("/applications/{appId}/risks")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    @ResponseStatus(HttpStatus.CREATED)
    public RiskDTO createRisk(@PathVariable Long appId, @Valid @RequestBody RiskCreateDTO dto) {
        return riskService.createManualRisk(appId, dto);
    }

    @PutMapping("/applications/{appId}/risks/{riskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    public RiskDTO updateRisk(@PathVariable Long appId, @PathVariable Long riskId,
                              @Valid @RequestBody RiskUpdateDTO dto) {
        return riskService.updateRisk(appId, riskId, dto);
    }

    @DeleteMapping("/applications/{appId}/risks/{riskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRisk(@PathVariable Long appId, @PathVariable Long riskId) {
        riskService.deleteRisk(appId, riskId);
    }

    @PostMapping("/applications/{appId}/risks/compute")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    public List<RiskDTO> computeRisks(@PathVariable Long appId) {
        return riskService.computeRisks(appId);
    }
}
