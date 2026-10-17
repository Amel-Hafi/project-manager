package com.projectmonitor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProjectCreateDTO {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private Long clientId;
}
