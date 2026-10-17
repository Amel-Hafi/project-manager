package com.projectmonitor.dto;

import com.projectmonitor.model.enums.AssignmentRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectAssignmentDTO {
    private Long id;
    private Long userId;
    private String username;
    private Long projectId;
    private String projectName;
    private AssignmentRole role;
}
