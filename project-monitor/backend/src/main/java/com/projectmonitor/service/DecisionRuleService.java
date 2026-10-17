package com.projectmonitor.service;

import com.projectmonitor.dto.DecisionRuleCreateDTO;
import com.projectmonitor.dto.DecisionRuleDTO;
import com.projectmonitor.dto.DecisionRuleUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.DecisionRule;
import com.projectmonitor.model.enums.ConditionType;
import com.projectmonitor.repository.DecisionRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DecisionRuleService {

    private final DecisionRuleRepository decisionRuleRepository;

    public List<DecisionRuleDTO> getAll() {
        return decisionRuleRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public DecisionRuleDTO getById(Long id) {
        return toDTO(findById(id));
    }

    @Transactional
    public DecisionRuleDTO create(DecisionRuleCreateDTO dto) {
        validateThreshold(dto.getConditionType(), dto.getThreshold());

        DecisionRule rule = DecisionRule.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .dimension(dto.getDimension())
                .conditionType(dto.getConditionType())
                .threshold(dto.getThreshold())
                .aggregationLevel(dto.getAggregationLevel())
                .trafficLightResult(dto.getTrafficLightResult())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        return toDTO(decisionRuleRepository.save(rule));
    }

    @Transactional
    public DecisionRuleDTO update(Long id, DecisionRuleUpdateDTO dto) {
        DecisionRule rule = findById(id);

        if (dto.getName() != null) rule.setName(dto.getName());
        if (dto.getDescription() != null) rule.setDescription(dto.getDescription());
        if (dto.getDimension() != null) rule.setDimension(dto.getDimension());
        if (dto.getConditionType() != null) rule.setConditionType(dto.getConditionType());
        if (dto.getThreshold() != null) {
            ConditionType type = dto.getConditionType() != null ? dto.getConditionType() : rule.getConditionType();
            validateThreshold(type, dto.getThreshold());
            rule.setThreshold(dto.getThreshold());
        }
        if (dto.getAggregationLevel() != null) rule.setAggregationLevel(dto.getAggregationLevel());
        if (dto.getTrafficLightResult() != null) rule.setTrafficLightResult(dto.getTrafficLightResult());
        if (dto.getActive() != null) rule.setActive(dto.getActive());

        return toDTO(decisionRuleRepository.save(rule));
    }

    @Transactional
    public void delete(Long id) {
        DecisionRule rule = findById(id);
        decisionRuleRepository.delete(rule);
    }

    @Transactional
    public DecisionRuleDTO activate(Long id) {
        DecisionRule rule = findById(id);
        rule.setActive(true);
        return toDTO(decisionRuleRepository.save(rule));
    }

    @Transactional
    public DecisionRuleDTO deactivate(Long id) {
        DecisionRule rule = findById(id);
        rule.setActive(false);
        return toDTO(decisionRuleRepository.save(rule));
    }

    private DecisionRule findById(Long id) {
        return decisionRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Decision rule not found: " + id));
    }

    private void validateThreshold(ConditionType conditionType, Double threshold) {
        if (conditionType == ConditionType.VALUE_BELOW_THRESHOLD) {
            if (threshold < 0 || threshold > 10) {
                throw new IllegalArgumentException("Threshold must be between 0 and 10 for VALUE_BELOW_THRESHOLD");
            }
        } else if (conditionType == ConditionType.PERCENTAGE_BELOW_THRESHOLD) {
            if (threshold < 0 || threshold > 100) {
                throw new IllegalArgumentException("Threshold must be between 0 and 100 for PERCENTAGE_BELOW_THRESHOLD");
            }
        }
    }

    private DecisionRuleDTO toDTO(DecisionRule rule) {
        return DecisionRuleDTO.builder()
                .id(rule.getId())
                .name(rule.getName())
                .description(rule.getDescription())
                .dimension(rule.getDimension())
                .conditionType(rule.getConditionType())
                .threshold(rule.getThreshold())
                .aggregationLevel(rule.getAggregationLevel())
                .trafficLightResult(rule.getTrafficLightResult())
                .active(rule.getActive())
                .createdAt(rule.getCreatedAt())
                .updatedAt(rule.getUpdatedAt())
                .build();
    }
}
