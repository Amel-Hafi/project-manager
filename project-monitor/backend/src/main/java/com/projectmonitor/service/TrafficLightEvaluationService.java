package com.projectmonitor.service;

import com.projectmonitor.dto.EvaluationResultDTO;
import com.projectmonitor.model.*;
import com.projectmonitor.model.enums.AggregationLevel;
import com.projectmonitor.model.enums.ConditionType;
import com.projectmonitor.model.enums.KpiDimension;
import com.projectmonitor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TrafficLightEvaluationService {

    private final DecisionRuleRepository decisionRuleRepository;
    private final MaturityKpiRepository maturityKpiRepository;
    private final ApplicationRepository applicationRepository;
    private final RiskRepository riskRepository;
    private final ProjectRepository projectRepository;
    private final ClientRepository clientRepository;

    public TrafficLightStatus evaluateApplication(Long appId) {
        List<DecisionRule> rules = decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION);
        if (rules.isEmpty()) {
            return evaluateApplicationFallback(appId);
        }

        MaturityKpi kpi = maturityKpiRepository.findByApplicationId(appId).orElse(null);
        if (kpi == null) {
            return TrafficLightStatus.RED;
        }

        TrafficLightStatus worstStatus = null;
        for (DecisionRule rule : rules) {
            if (ruleFires(rule, kpi)) {
                worstStatus = worstOf(worstStatus, rule.getTrafficLightResult());
            }
        }

        return worstStatus != null ? worstStatus : evaluateApplicationFallback(appId);
    }

    public TrafficLightStatus evaluateProject(Long projectId) {
        List<DecisionRule> rules = decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.PROJECT);
        if (rules.isEmpty()) {
            return evaluateProjectFallback(projectId);
        }

        List<MaturityKpi> kpis = maturityKpiRepository.findByApplicationProjectId(projectId);
        if (kpis.isEmpty()) {
            return TrafficLightStatus.RED;
        }

        Double projectAverage = computeProjectAverage(kpis);
        TrafficLightStatus worstStatus = null;

        for (DecisionRule rule : rules) {
            if (rule.getConditionType() == ConditionType.VALUE_BELOW_THRESHOLD) {
                Double value = getDimensionAverage(kpis, rule.getDimension());
                if (value != null && value < rule.getThreshold()) {
                    worstStatus = worstOf(worstStatus, rule.getTrafficLightResult());
                } else if (value == null && rule.getDimension() == null && projectAverage != null && projectAverage < rule.getThreshold()) {
                    worstStatus = worstOf(worstStatus, rule.getTrafficLightResult());
                }
            }
            // PERCENTAGE_BELOW_THRESHOLD: not implemented in MVP
        }

        return worstStatus != null ? worstStatus : evaluateProjectFallback(projectId);
    }

    public TrafficLightStatus evaluateClient(Long clientId) {
        List<DecisionRule> rules = decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.CLIENT);
        if (rules.isEmpty()) {
            return evaluateClientFallback(clientId);
        }

        List<Project> projects = projectRepository.findAllByClientId(clientId);
        if (projects.isEmpty()) {
            return TrafficLightStatus.RED;
        }

        List<MaturityKpi> allKpis = projects.stream()
                .flatMap(p -> maturityKpiRepository.findByApplicationProjectId(p.getId()).stream())
                .toList();

        if (allKpis.isEmpty()) {
            return TrafficLightStatus.RED;
        }

        Double clientAverage = computeProjectAverage(allKpis);
        TrafficLightStatus worstStatus = null;

        for (DecisionRule rule : rules) {
            if (rule.getConditionType() == ConditionType.VALUE_BELOW_THRESHOLD) {
                Double value = getDimensionAverage(allKpis, rule.getDimension());
                if (value != null && value < rule.getThreshold()) {
                    worstStatus = worstOf(worstStatus, rule.getTrafficLightResult());
                } else if (value == null && rule.getDimension() == null && clientAverage != null && clientAverage < rule.getThreshold()) {
                    worstStatus = worstOf(worstStatus, rule.getTrafficLightResult());
                }
            }
        }

        return worstStatus != null ? worstStatus : evaluateClientFallback(clientId);
    }

    @Transactional
    public EvaluationResultDTO evaluateAll() {
        List<Application> applications = applicationRepository.findAll();
        int evaluated = 0;
        int risksCreated = 0;
        int risksResolved = 0;

        List<DecisionRule> appRules = decisionRuleRepository.findByActiveTrueAndAggregationLevel(AggregationLevel.APPLICATION);

        for (Application app : applications) {
            evaluated++;
            if (appRules.isEmpty()) continue;

            MaturityKpi kpi = maturityKpiRepository.findByApplicationId(app.getId()).orElse(null);
            if (kpi == null) continue;

            boolean redFired = false;
            for (DecisionRule rule : appRules) {
                if (ruleFires(rule, kpi) && rule.getTrafficLightResult() == TrafficLightStatus.RED) {
                    redFired = true;
                    break;
                }
            }

            if (redFired) {
                // Check if an automatic risk already exists for this app
                List<Risk> existingAutoRisks = riskRepository.findByApplicationIdAndSourceAndResolved(
                        app.getId(), RiskSource.AUTO, false);
                if (existingAutoRisks.isEmpty()) {
                    Risk risk = Risk.builder()
                            .application(app)
                            .type(RiskType.AUTOMATIC)
                            .source(RiskSource.AUTO)
                            .severity(RiskSeverity.HIGH)
                            .description("Automatic risk: KPI threshold rule triggered for application " + app.getName())
                            .resolved(false)
                            .createdBy("SYSTEM")
                            .build();
                    riskRepository.save(risk);
                    risksCreated++;
                }
            } else {
                // Resolve existing automatic risks if no RED rule fires
                List<Risk> existingAutoRisks = riskRepository.findByApplicationIdAndSourceAndResolved(
                        app.getId(), RiskSource.AUTO, false);
                for (Risk risk : existingAutoRisks) {
                    if (risk.getType() == RiskType.AUTOMATIC) {
                        risk.setResolved(true);
                        riskRepository.save(risk);
                        risksResolved++;
                    }
                }
            }
        }

        return EvaluationResultDTO.builder()
                .evaluated(evaluated)
                .risksCreated(risksCreated)
                .risksResolved(risksResolved)
                .build();
    }

    private boolean ruleFires(DecisionRule rule, MaturityKpi kpi) {
        if (rule.getConditionType() != ConditionType.VALUE_BELOW_THRESHOLD) {
            return false; // PERCENTAGE_BELOW_THRESHOLD not implemented in MVP
        }

        Double value;
        if (rule.getDimension() == null) {
            value = computeKpiAverage(kpi);
        } else {
            value = getKpiDimensionValue(kpi, rule.getDimension());
        }

        return value != null && value < rule.getThreshold();
    }

    private Double getKpiDimensionValue(MaturityKpi kpi, KpiDimension dimension) {
        return switch (dimension) {
            case INDUSTRIALIZATION -> kpi.getIndustrialization() != null ? kpi.getIndustrialization().doubleValue() : null;
            case CODE_QUALITY -> kpi.getCodeQuality() != null ? kpi.getCodeQuality().doubleValue() : null;
            case TESTING -> kpi.getTesting() != null ? kpi.getTesting().doubleValue() : null;
            case DEPLOYMENT -> kpi.getDeployment() != null ? kpi.getDeployment().doubleValue() : null;
            case OBSOLESCENCE -> kpi.getObsolescence() != null ? kpi.getObsolescence().doubleValue() : null;
            case AI_ADOPTION -> kpi.getAiAdoption() != null ? kpi.getAiAdoption().doubleValue() : null;
        };
    }

    private Double computeKpiAverage(MaturityKpi kpi) {
        List<Double> values = Stream.of(
                kpi.getIndustrialization(),
                kpi.getCodeQuality(),
                kpi.getTesting(),
                kpi.getDeployment(),
                kpi.getObsolescence(),
                kpi.getAiAdoption()
        ).filter(Objects::nonNull).map(Integer::doubleValue).toList();

        if (values.isEmpty()) return null;
        return values.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    private Double getDimensionAverage(List<MaturityKpi> kpis, KpiDimension dimension) {
        if (dimension == null) {
            // Return overall average across all KPIs
            List<Double> averages = kpis.stream()
                    .map(this::computeKpiAverage)
                    .filter(Objects::nonNull)
                    .toList();
            if (averages.isEmpty()) return null;
            return averages.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        }

        List<Double> values = kpis.stream()
                .map(kpi -> getKpiDimensionValue(kpi, dimension))
                .filter(Objects::nonNull)
                .toList();
        if (values.isEmpty()) return null;
        return values.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    private Double computeProjectAverage(List<MaturityKpi> kpis) {
        return getDimensionAverage(kpis, null);
    }

    private TrafficLightStatus worstOf(TrafficLightStatus a, TrafficLightStatus b) {
        if (a == null) return b;
        if (b == null) return a;
        if (a == TrafficLightStatus.RED || b == TrafficLightStatus.RED) return TrafficLightStatus.RED;
        if (a == TrafficLightStatus.YELLOW || b == TrafficLightStatus.YELLOW) return TrafficLightStatus.YELLOW;
        return TrafficLightStatus.GREEN;
    }

    private TrafficLightStatus evaluateApplicationFallback(Long appId) {
        MaturityKpi kpi = maturityKpiRepository.findByApplicationId(appId).orElse(null);
        if (kpi == null) return TrafficLightStatus.RED;
        return TrafficLightStatus.fromAverage(computeKpiAverage(kpi));
    }

    private TrafficLightStatus evaluateProjectFallback(Long projectId) {
        List<MaturityKpi> kpis = maturityKpiRepository.findByApplicationProjectId(projectId);
        if (kpis.isEmpty()) return TrafficLightStatus.RED;
        return TrafficLightStatus.fromAverage(computeProjectAverage(kpis));
    }

    private TrafficLightStatus evaluateClientFallback(Long clientId) {
        List<Project> projects = projectRepository.findAllByClientId(clientId);
        List<MaturityKpi> allKpis = projects.stream()
                .flatMap(p -> maturityKpiRepository.findByApplicationProjectId(p.getId()).stream())
                .toList();
        if (allKpis.isEmpty()) return TrafficLightStatus.RED;
        return TrafficLightStatus.fromAverage(computeProjectAverage(allKpis));
    }
}
