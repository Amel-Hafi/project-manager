package com.projectmonitor.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class AiSuccessCaseUpdateDTO {
    private String title;
    private String tool;
    private String profile;
    private String description;
    private String estimatedImpact;
    private LocalDate caseDate;
}
