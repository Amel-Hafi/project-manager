package com.projectmonitor.dto;

import com.projectmonitor.model.enums.KpiDimension;
import com.projectmonitor.validation.ValidKpiContent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KpiTemplateCreateDTO {

    @NotNull
    private KpiDimension dimension;

    @NotBlank
    @Size(max = 20)
    private String version;

    @NotNull
    @ValidKpiContent
    private Map<Integer, String> content;

    private boolean active;
}
