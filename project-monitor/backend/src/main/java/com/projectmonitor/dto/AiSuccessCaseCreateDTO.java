package com.projectmonitor.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class AiSuccessCaseCreateDTO {
    @NotBlank
    private String title;
    @NotBlank
    private String tool;
    @NotBlank
    private String profile;
    private String description;
    private String estimatedImpact;
    private LocalDate caseDate;
}
