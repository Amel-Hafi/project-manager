package com.projectmonitor.dto;

import com.projectmonitor.model.enums.KpiDimension;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KpiTemplateResponseDTO {
    private Long id;
    private KpiDimension dimension;
    private String version;
    private Map<Integer, String> content;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
