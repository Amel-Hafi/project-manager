package com.projectmonitor.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MaturityKpiUpdateDTO {
    @Min(1) @Max(10)
    private Integer industrialization;

    @Min(1) @Max(10)
    private Integer codeQuality;

    @Min(1) @Max(10)
    private Integer testing;

    @Min(1) @Max(10)
    private Integer deployment;

    @Min(1) @Max(10)
    private Integer obsolescence;

    @Min(1) @Max(10)
    private Integer aiAdoption;

    @Size(max = 2000)
    private String justificationIndustrialization;

    @Size(max = 2000)
    private String justificationCodeQuality;

    @Size(max = 2000)
    private String justificationTesting;

    @Size(max = 2000)
    private String justificationDeployment;

    @Size(max = 2000)
    private String justificationObsolescence;

    @Size(max = 2000)
    private String justificationAiAdoption;
}
