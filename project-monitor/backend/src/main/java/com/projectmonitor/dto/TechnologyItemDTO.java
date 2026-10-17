package com.projectmonitor.dto;

import com.projectmonitor.model.enums.TechnologyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnologyItemDTO {
    private Long id;
    private String name;
    private String version;
    private String description;
    private TechnologyStatus status;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
