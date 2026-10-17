package com.projectmonitor.controller;

import com.projectmonitor.dto.AiSuccessCaseCreateDTO;
import com.projectmonitor.dto.AiSuccessCaseDTO;
import com.projectmonitor.dto.AiSuccessCaseUpdateDTO;
import com.projectmonitor.model.AiCaseStatus;
import com.projectmonitor.service.AiSuccessCaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AiSuccessCaseController {

    private final AiSuccessCaseService aiSuccessCaseService;

    @GetMapping("/applications/{appId}/ai-success-cases")
    @PreAuthorize("isAuthenticated()")
    public List<AiSuccessCaseDTO> getByApplication(@PathVariable Long appId) {
        return aiSuccessCaseService.getByApplication(appId);
    }

    @PostMapping("/applications/{appId}/ai-success-cases")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    public ResponseEntity<AiSuccessCaseDTO> create(@PathVariable Long appId,
                                                    @Valid @RequestBody AiSuccessCaseCreateDTO dto) {
        AiSuccessCaseDTO created = aiSuccessCaseService.create(appId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/ai-success-cases/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DT_REFERENT')")
    public AiSuccessCaseDTO update(@PathVariable Long id, @Valid @RequestBody AiSuccessCaseUpdateDTO dto) {
        return aiSuccessCaseService.update(id, dto);
    }

    @PatchMapping("/ai-success-cases/{id}/validate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public AiSuccessCaseDTO validate(@PathVariable Long id) {
        return aiSuccessCaseService.validate(id);
    }

    @DeleteMapping("/ai-success-cases/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        aiSuccessCaseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ai-success-cases")
    @PreAuthorize("isAuthenticated()")
    public List<AiSuccessCaseDTO> getAll(@RequestParam(required = false) AiCaseStatus status) {
        return aiSuccessCaseService.getAll(status);
    }
}
