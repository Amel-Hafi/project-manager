package com.projectmonitor.dto;

import com.projectmonitor.model.enums.TechnologyCategoryCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnologyCategoryDTO {
    private Long id;
    private TechnologyCategoryCode code;
    private String name;
    private String description;
}
