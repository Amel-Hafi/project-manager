package com.projectmonitor.repository;

import com.projectmonitor.model.KpiTemplate;
import com.projectmonitor.model.enums.KpiDimension;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KpiTemplateRepository extends JpaRepository<KpiTemplate, Long> {
    Optional<KpiTemplate> findByDimensionAndActiveTrue(KpiDimension dimension);
    List<KpiTemplate> findByDimension(KpiDimension dimension);
    List<KpiTemplate> findByActiveTrue();
}
