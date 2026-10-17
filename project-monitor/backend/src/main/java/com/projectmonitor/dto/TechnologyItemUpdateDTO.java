package com.projectmonitor.dto;

import com.projectmonitor.model.enums.TechnologyCategoryCode;
import com.projectmonitor.model.enums.TechnologyStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TechnologyItemUpdateDTO {
    @NotBlank
    private String name;
    private String version;
    private String description;
    private TechnologyStatus status;
    private TechnologyCategoryCode categoryCode;
}
