package com.projectmonitor.dto;

import com.projectmonitor.model.enums.TechnologyCategoryCode;
import com.projectmonitor.model.enums.TechnologyStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TechnologyItemCreateDTO {
    @NotBlank
    private String name;
    private String version;
    private String description;
    private TechnologyStatus status;
    @NotNull
    private TechnologyCategoryCode categoryCode;
}
