package com.projectmonitor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferentWorkloadDTO {
    private Long userId;
    private String username;
    private String fullName;
    private Integer applicationCount;
    private Integer projectCount;
}
