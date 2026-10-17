package com.projectmonitor.service;

import com.projectmonitor.dto.EvaluationResultDTO;
import com.projectmonitor.model.*;
import com.projectmonitor.model.enums.AggregationLevel;
import com.projectmonitor.model.enums.ConditionType;
import com.projectmonitor.model.enums.KpiDimension;
import com.projectmonitor.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrafficLightEvaluationServiceTest {

    @Mock
    private DecisionRuleRepository decisionRuleRepository;

    @Mock
    private MaturityKpiRepository maturityKpiRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private RiskRepository riskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private TrafficLightEvaluationService evaluationService;

    private Application application;
    private Project project;
    private MaturityKpi kpi;
    private DecisionRule redRule;

    @BeforeEach
    void setUp() {
        project = Project.builder().id(1L).name("Project").build();
        application = Application.builder().id(10L).name("App").project(project).build();
        kpi = MaturityKpi.builder()
                .id(1L)
                .application(application)
                .industrialization(8)
                .codeQuality(3) // below threshold
                .testing(7)
                .deployment(6)
                .obsolescence(5)
                .aiAdoption(4)
                .build();

        redRule = DecisionRule.builder()
                .id(1L)
                .name("Low code quality")
                .dimension(KpiDimension.CODE_QUALITY)
                .conditionType(ConditionType.VALUE_BELOW_THRESHOLD)
                .threshold(5.0)
                .aggregationLevel(AggregationLevel.APPLICATION)
                .trafficLightResult(TrafficLightStatus.RED)
                .active(true)
                .build();
    }

    @Test
    void evaluateApplication_noRules_fallsBackToFromAverage() {
        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION))
                .thenReturn(List.of());
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));

        TrafficLightStatus result = evaluationService.evaluateApplication(10L);

        // Average of 8,3,7,6,5,4 = 5.5 => YELLOW
        assertThat(result).isEqualTo(TrafficLightStatus.YELLOW);
    }

    @Test
    void evaluateApplication_ruleFires_returnsRuleResult() {
        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION))
                .thenReturn(List.of(redRule));
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));

        TrafficLightStatus result = evaluationService.evaluateApplication(10L);

        assertThat(result).isEqualTo(TrafficLightStatus.RED);
    }

    @Test
    void evaluateApplication_ruleDoesNotFire_fallsBack() {
        redRule.setThreshold(2.0); // code quality is 3, which is >= 2
        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION))
                .thenReturn(List.of(redRule));
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));

        TrafficLightStatus result = evaluationService.evaluateApplication(10L);

        // No rule fired, fallback: avg=5.5 => YELLOW
        assertThat(result).isEqualTo(TrafficLightStatus.YELLOW);
    }

    @Test
    void evaluateApplication_noKpi_returnsRed() {
        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION))
                .thenReturn(List.of(redRule));
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.empty());

        TrafficLightStatus result = evaluationService.evaluateApplication(10L);

        assertThat(result).isEqualTo(TrafficLightStatus.RED);
    }

    @Test
    void evaluateApplication_nullDimension_checksOverallAverage() {
        DecisionRule globalRule = DecisionRule.builder()
                .id(2L)
                .name("Low overall")
                .dimension(null)
                .conditionType(ConditionType.VALUE_BELOW_THRESHOLD)
                .threshold(6.0) // avg is 5.5 < 6
                .aggregationLevel(AggregationLevel.APPLICATION)
                .trafficLightResult(TrafficLightStatus.YELLOW)
                .active(true)
                .build();

        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION))
                .thenReturn(List.of(globalRule));
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));

        TrafficLightStatus result = evaluationService.evaluateApplication(10L);

        assertThat(result).isEqualTo(TrafficLightStatus.YELLOW);
    }

    @Test
    void evaluateProject_noRules_fallsBack() {
        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.PROJECT))
                .thenReturn(List.of());
        when(maturityKpiRepository.findByApplicationProjectId(1L)).thenReturn(List.of(kpi));

        TrafficLightStatus result = evaluationService.evaluateProject(1L);

        // avg = 5.5 => YELLOW
        assertThat(result).isEqualTo(TrafficLightStatus.YELLOW);
    }

    @Test
    void evaluateProject_ruleFires_returnsWorstStatus() {
        DecisionRule projectRule = DecisionRule.builder()
                .id(3L)
                .name("Low project code quality")
                .dimension(KpiDimension.CODE_QUALITY)
                .conditionType(ConditionType.VALUE_BELOW_THRESHOLD)
                .threshold(5.0)
                .aggregationLevel(AggregationLevel.PROJECT)
                .trafficLightResult(TrafficLightStatus.RED)
                .active(true)
                .build();

        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.PROJECT))
                .thenReturn(List.of(projectRule));
        when(maturityKpiRepository.findByApplicationProjectId(1L)).thenReturn(List.of(kpi));

        TrafficLightStatus result = evaluationService.evaluateProject(1L);

        assertThat(result).isEqualTo(TrafficLightStatus.RED);
    }

    @Test
    void evaluateAll_createsRiskWhenRedFires() {
        when(applicationRepository.findAll()).thenReturn(List.of(application));
        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION))
                .thenReturn(List.of(redRule));
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));
        when(riskRepository.findByApplicationIdAndSourceAndResolved(10L, RiskSource.AUTO, false))
                .thenReturn(List.of());
        when(riskRepository.save(any(Risk.class))).thenReturn(Risk.builder().id(1L).build());

        EvaluationResultDTO result = evaluationService.evaluateAll();

        assertThat(result.getEvaluated()).isEqualTo(1);
        assertThat(result.getRisksCreated()).isEqualTo(1);
        assertThat(result.getRisksResolved()).isEqualTo(0);
        verify(riskRepository).save(any(Risk.class));
    }

    @Test
    void evaluateAll_resolvesRiskWhenNoRedFires() {
        redRule.setThreshold(2.0); // won't fire since code quality is 3

        Risk existingRisk = Risk.builder()
                .id(100L)
                .application(application)
                .type(RiskType.AUTOMATIC)
                .source(RiskSource.AUTO)
                .resolved(false)
                .build();

        when(applicationRepository.findAll()).thenReturn(List.of(application));
        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION))
                .thenReturn(List.of(redRule));
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));
        when(riskRepository.findByApplicationIdAndSourceAndResolved(10L, RiskSource.AUTO, false))
                .thenReturn(List.of(existingRisk));
        when(riskRepository.save(any(Risk.class))).thenReturn(existingRisk);

        EvaluationResultDTO result = evaluationService.evaluateAll();

        assertThat(result.getEvaluated()).isEqualTo(1);
        assertThat(result.getRisksCreated()).isEqualTo(0);
        assertThat(result.getRisksResolved()).isEqualTo(1);
    }

    @Test
    void evaluateAll_noRules_noRisksCreated() {
        when(applicationRepository.findAll()).thenReturn(List.of(application));
        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION))
                .thenReturn(List.of());

        EvaluationResultDTO result = evaluationService.evaluateAll();

        assertThat(result.getEvaluated()).isEqualTo(1);
        assertThat(result.getRisksCreated()).isEqualTo(0);
        assertThat(result.getRisksResolved()).isEqualTo(0);
        verify(riskRepository, never()).save(any());
    }

    @Test
    void worstStatus_multipleRules_returnsRed() {
        DecisionRule yellowRule = DecisionRule.builder()
                .id(2L)
                .name("Yellow rule")
                .dimension(KpiDimension.OBSOLESCENCE)
                .conditionType(ConditionType.VALUE_BELOW_THRESHOLD)
                .threshold(6.0) // obsolescence is 5 < 6
                .aggregationLevel(AggregationLevel.APPLICATION)
                .trafficLightResult(TrafficLightStatus.YELLOW)
                .active(true)
                .build();

        when(decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION))
                .thenReturn(List.of(redRule, yellowRule));
        when(maturityKpiRepository.findByApplicationId(10L)).thenReturn(Optional.of(kpi));

        TrafficLightStatus result = evaluationService.evaluateApplication(10L);

        assertThat(result).isEqualTo(TrafficLightStatus.RED);
    }
}
