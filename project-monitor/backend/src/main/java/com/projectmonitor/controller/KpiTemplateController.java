package com.projectmonitor.controller;

import com.projectmonitor.dto.KpiTemplateCreateDTO;
import com.projectmonitor.dto.KpiTemplateResponseDTO;
import com.projectmonitor.dto.KpiTemplateUpdateDTO;
import com.projectmonitor.model.enums.KpiDimension;
import com.projectmonitor.service.KpiTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/kpi-templates")
@RequiredArgsConstructor
public class KpiTemplateController {

    private final KpiTemplateService kpiTemplateService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<KpiTemplateResponseDTO> getAll(@RequestParam(required = false) KpiDimension dimension) {
        return kpiTemplateService.getAll(dimension);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public KpiTemplateResponseDTO getById(@PathVariable Long id) {
        return kpiTemplateService.getById(id);
    }

    @GetMapping("/active/{dimension}")
    @PreAuthorize("isAuthenticated()")
    public KpiTemplateResponseDTO getActiveByDimension(@PathVariable KpiDimension dimension) {
        return kpiTemplateService.getActiveByDimension(dimension);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public KpiTemplateResponseDTO create(@Valid @RequestBody KpiTemplateCreateDTO dto) {
        return kpiTemplateService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public KpiTemplateResponseDTO update(@PathVariable Long id, @Valid @RequestBody KpiTemplateUpdateDTO dto) {
        return kpiTemplateService.update(id, dto);
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public KpiTemplateResponseDTO activate(@PathVariable Long id) {
        return kpiTemplateService.activate(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        kpiTemplateService.delete(id);
    }
}
