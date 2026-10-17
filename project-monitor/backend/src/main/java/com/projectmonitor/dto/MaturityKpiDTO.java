package com.projectmonitor.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaturityKpiDTO {
    private Long id;
    private Long applicationId;
    private String applicationName;
    private Integer industrialization;
    private Integer codeQuality;
    private Integer testing;
    private Integer deployment;
    private Integer obsolescence;
    private Integer aiAdoption;
    private String justificationIndustrialization;
    private String justificationCodeQuality;
    private String justificationTesting;
    private String justificationDeployment;
    private String justificationObsolescence;
    private String justificationAiAdoption;
    private LocalDateTime evaluatedAt;
    private LocalDateTime updatedAt;
}
