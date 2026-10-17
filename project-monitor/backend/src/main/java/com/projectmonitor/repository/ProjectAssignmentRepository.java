package com.projectmonitor.repository;

import com.projectmonitor.model.ProjectAssignment;
import com.projectmonitor.model.enums.AssignmentRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Long> {
    boolean existsByUserIdAndProjectId(Long userId, Long projectId);
    List<ProjectAssignment> findByUserId(Long userId);
    List<ProjectAssignment> findByRole(AssignmentRole role);
    List<ProjectAssignment> findByProjectId(Long projectId);
}
