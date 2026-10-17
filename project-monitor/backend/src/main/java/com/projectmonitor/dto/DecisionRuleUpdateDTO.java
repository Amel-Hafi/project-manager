package com.projectmonitor.dto;

import com.projectmonitor.model.TrafficLightStatus;
import com.projectmonitor.model.enums.AggregationLevel;
import com.projectmonitor.model.enums.ConditionType;
import com.projectmonitor.model.enums.KpiDimension;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DecisionRuleUpdateDTO {

    @Size(max = 200)
    private String name;

    @Size(max = 1000)
    private String description;

    private KpiDimension dimension;

    private ConditionType conditionType;

    private Double threshold;

    private AggregationLevel aggregationLevel;

    private TrafficLightStatus trafficLightResult;

    private Boolean active;
}
