package com.projectmonitor.dto;

import com.projectmonitor.model.RiskSeverity;
import com.projectmonitor.model.RiskType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiskCreateDTO {
    @NotNull
    private RiskType type;

    @NotNull
    private RiskSeverity severity;

    @NotBlank
    @Size(max = 1000)
    private String description;

    @Size(max = 2000)
    private String actionPlan;
}
