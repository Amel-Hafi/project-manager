package com.projectmonitor.dto;

import com.projectmonitor.model.TrafficLightStatus;
import com.projectmonitor.model.enums.AggregationLevel;
import com.projectmonitor.model.enums.ConditionType;
import com.projectmonitor.model.enums.KpiDimension;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DecisionRuleDTO {
    private Long id;
    private String name;
    private String description;
    private KpiDimension dimension;
    private ConditionType conditionType;
    private Double threshold;
    private AggregationLevel aggregationLevel;
    private TrafficLightStatus trafficLightResult;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
