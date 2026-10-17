package com.projectmonitor.service;

import com.projectmonitor.dto.DecisionRuleCreateDTO;
import com.projectmonitor.dto.DecisionRuleDTO;
import com.projectmonitor.dto.DecisionRuleUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.DecisionRule;
import com.projectmonitor.model.TrafficLightStatus;
import com.projectmonitor.model.enums.AggregationLevel;
import com.projectmonitor.model.enums.ConditionType;
import com.projectmonitor.model.enums.KpiDimension;
import com.projectmonitor.repository.DecisionRuleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DecisionRuleServiceTest {

    @Mock
    private DecisionRuleRepository decisionRuleRepository;

    @InjectMocks
    private DecisionRuleService decisionRuleService;

    private DecisionRule rule;

    @BeforeEach
    void setUp() {
        rule = DecisionRule.builder()
                .id(1L)
                .name("Test Rule")
                .description("Test description")
                .dimension(KpiDimension.CODE_QUALITY)
                .conditionType(ConditionType.VALUE_BELOW_THRESHOLD)
                .threshold(5.0)
                .aggregationLevel(AggregationLevel.APPLICATION)
                .trafficLightResult(TrafficLightStatus.RED)
                .active(true)
                .build();
    }

    @Test
    void getAll_returnsAllRules() {
        when(decisionRuleRepository.findAll()).thenReturn(List.of(rule));

        List<DecisionRuleDTO> result = decisionRuleService.getAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Rule");
    }

    @Test
    void getById_existingId_returnsRule() {
        when(decisionRuleRepository.findById(1L)).thenReturn(Optional.of(rule));

        DecisionRuleDTO result = decisionRuleService.getById(1L);

        assertThat(result.getName()).isEqualTo("Test Rule");
        assertThat(result.getThreshold()).isEqualTo(5.0);
    }

    @Test
    void getById_nonExistingId_throwsException() {
        when(decisionRuleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> decisionRuleService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_validDto_returnsCreatedRule() {
        DecisionRuleCreateDTO dto = new DecisionRuleCreateDTO();
        dto.setName("New Rule");
        dto.setConditionType(ConditionType.VALUE_BELOW_THRESHOLD);
        dto.setThreshold(7.0);
        dto.setAggregationLevel(AggregationLevel.APPLICATION);
        dto.setTrafficLightResult(TrafficLightStatus.YELLOW);

        when(decisionRuleRepository.save(any(DecisionRule.class))).thenReturn(rule);

        DecisionRuleDTO result = decisionRuleService.create(dto);

        assertThat(result).isNotNull();
        verify(decisionRuleRepository).save(any(DecisionRule.class));
    }

    @Test
    void create_invalidThresholdForValueType_throwsException() {
        DecisionRuleCreateDTO dto = new DecisionRuleCreateDTO();
        dto.setName("Bad Rule");
        dto.setConditionType(ConditionType.VALUE_BELOW_THRESHOLD);
        dto.setThreshold(15.0); // > 10
        dto.setAggregationLevel(AggregationLevel.APPLICATION);
        dto.setTrafficLightResult(TrafficLightStatus.RED);

        assertThatThrownBy(() -> decisionRuleService.create(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("between 0 and 10");
    }

    @Test
    void create_invalidThresholdForPercentageType_throwsException() {
        DecisionRuleCreateDTO dto = new DecisionRuleCreateDTO();
        dto.setName("Bad Rule");
        dto.setConditionType(ConditionType.PERCENTAGE_BELOW_THRESHOLD);
        dto.setThreshold(150.0); // > 100
        dto.setAggregationLevel(AggregationLevel.PROJECT);
        dto.setTrafficLightResult(TrafficLightStatus.RED);

        assertThatThrownBy(() -> decisionRuleService.create(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("between 0 and 100");
    }

    @Test
    void update_existingId_updatesFields() {
        when(decisionRuleRepository.findById(1L)).thenReturn(Optional.of(rule));
        when(decisionRuleRepository.save(any(DecisionRule.class))).thenReturn(rule);

        DecisionRuleUpdateDTO dto = new DecisionRuleUpdateDTO();
        dto.setName("Updated Rule");
        dto.setThreshold(8.0);

        DecisionRuleDTO result = decisionRuleService.update(1L, dto);

        assertThat(result).isNotNull();
        verify(decisionRuleRepository).save(any(DecisionRule.class));
    }

    @Test
    void delete_existingId_deletesRule() {
        when(decisionRuleRepository.findById(1L)).thenReturn(Optional.of(rule));

        decisionRuleService.delete(1L);

        verify(decisionRuleRepository).delete(rule);
    }

    @Test
    void activate_setsActiveTrue() {
        rule.setActive(false);
        when(decisionRuleRepository.findById(1L)).thenReturn(Optional.of(rule));
        when(decisionRuleRepository.save(any(DecisionRule.class))).thenReturn(rule);

        DecisionRuleDTO result = decisionRuleService.activate(1L);

        assertThat(result).isNotNull();
        verify(decisionRuleRepository).save(argThat(r -> r.getActive()));
    }

    @Test
    void deactivate_setsActiveFalse() {
        when(decisionRuleRepository.findById(1L)).thenReturn(Optional.of(rule));
        when(decisionRuleRepository.save(any(DecisionRule.class))).thenReturn(rule);

        DecisionRuleDTO result = decisionRuleService.deactivate(1L);

        assertThat(result).isNotNull();
        verify(decisionRuleRepository).save(argThat(r -> !r.getActive()));
    }
}
