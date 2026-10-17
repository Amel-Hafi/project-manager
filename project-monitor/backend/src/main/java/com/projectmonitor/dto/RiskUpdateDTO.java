package com.projectmonitor.dto;

import com.projectmonitor.model.RiskSeverity;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiskUpdateDTO {
    private RiskSeverity severity;

    @Size(max = 1000)
    private String description;

    @Size(max = 2000)
    private String actionPlan;

    private Boolean resolved;
}
