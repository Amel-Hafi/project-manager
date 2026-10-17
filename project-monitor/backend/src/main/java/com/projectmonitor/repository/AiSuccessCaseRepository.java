package com.projectmonitor.repository;

import com.projectmonitor.model.AiCaseStatus;
import com.projectmonitor.model.AiSuccessCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiSuccessCaseRepository extends JpaRepository<AiSuccessCase, Long> {
    List<AiSuccessCase> findByApplicationId(Long applicationId);
    List<AiSuccessCase> findByStatus(AiCaseStatus status);
    List<AiSuccessCase> findByApplicationProjectId(Long projectId);
}
