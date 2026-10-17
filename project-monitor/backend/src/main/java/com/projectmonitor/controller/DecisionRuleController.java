package com.projectmonitor.controller;

import com.projectmonitor.dto.DecisionRuleCreateDTO;
import com.projectmonitor.dto.DecisionRuleDTO;
import com.projectmonitor.dto.DecisionRuleUpdateDTO;
import com.projectmonitor.dto.EvaluationResultDTO;
import com.projectmonitor.service.DecisionRuleService;
import com.projectmonitor.service.TrafficLightEvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/decision-rules")
@RequiredArgsConstructor
public class DecisionRuleController {

    private final DecisionRuleService decisionRuleService;
    private final TrafficLightEvaluationService trafficLightEvaluationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<DecisionRuleDTO> getAll() {
        return decisionRuleService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public DecisionRuleDTO getById(@PathVariable Long id) {
        return decisionRuleService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public DecisionRuleDTO create(@Valid @RequestBody DecisionRuleCreateDTO dto) {
        return decisionRuleService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DecisionRuleDTO update(@PathVariable Long id, @Valid @RequestBody DecisionRuleUpdateDTO dto) {
        return decisionRuleService.update(id, dto);
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public DecisionRuleDTO activate(@PathVariable Long id) {
        return decisionRuleService.activate(id);
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public DecisionRuleDTO deactivate(@PathVariable Long id) {
        return decisionRuleService.deactivate(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        decisionRuleService.delete(id);
    }

    @PostMapping("/evaluate")
    @PreAuthorize("hasRole('ADMIN')")
    public EvaluationResultDTO evaluate() {
        return trafficLightEvaluationService.evaluateAll();
    }
}
