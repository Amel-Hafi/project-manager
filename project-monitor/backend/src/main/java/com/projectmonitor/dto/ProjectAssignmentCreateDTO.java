package com.projectmonitor.dto;

import com.projectmonitor.model.enums.AssignmentRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProjectAssignmentCreateDTO {
    @NotNull
    private Long userId;
    @NotNull
    private Long projectId;
    @NotNull
    private AssignmentRole role;
}
