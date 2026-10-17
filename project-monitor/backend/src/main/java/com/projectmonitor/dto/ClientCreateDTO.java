package com.projectmonitor.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClientCreateDTO {
    @NotBlank
    private String name;
    private String description;
}
