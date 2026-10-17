package com.projectmonitor.dto;

import com.projectmonitor.model.AiCaseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiSuccessCaseDTO {
    private Long id;
    private Long applicationId;
    private String applicationName;
    private String title;
    private String tool;
    private String profile;
    private String description;
    private String estimatedImpact;
    private LocalDate caseDate;
    private AiCaseStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
