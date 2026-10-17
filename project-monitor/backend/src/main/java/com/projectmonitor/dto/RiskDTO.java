package com.projectmonitor.dto;

import com.projectmonitor.model.RiskSeverity;
import com.projectmonitor.model.RiskSource;
import com.projectmonitor.model.RiskType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskDTO {
    private Long id;
    private Long applicationId;
    private String applicationName;
    private RiskType type;
    private RiskSource source;
    private RiskSeverity severity;
    private String description;
    private String actionPlan;
    private Boolean resolved;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
