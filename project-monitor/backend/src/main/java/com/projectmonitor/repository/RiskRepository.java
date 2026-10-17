package com.projectmonitor.repository;

import com.projectmonitor.model.Risk;
import com.projectmonitor.model.RiskSource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RiskRepository extends JpaRepository<Risk, Long> {
    List<Risk> findByApplicationId(Long applicationId);
    List<Risk> findByApplicationProjectId(Long projectId);
    void deleteByApplicationIdAndSource(Long applicationId, RiskSource source);
    List<Risk> findByApplicationIdAndSourceAndResolved(Long applicationId, RiskSource source, Boolean resolved);
}
