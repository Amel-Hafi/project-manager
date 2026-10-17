package com.projectmonitor.repository;

import com.projectmonitor.model.MaturityKpi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MaturityKpiRepository extends JpaRepository<MaturityKpi, Long> {
    Optional<MaturityKpi> findByApplicationId(Long applicationId);
    List<MaturityKpi> findByApplicationProjectId(Long projectId);
}
