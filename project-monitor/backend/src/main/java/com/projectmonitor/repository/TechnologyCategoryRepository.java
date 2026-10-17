package com.projectmonitor.repository;

import com.projectmonitor.model.TechnologyCategory;
import com.projectmonitor.model.enums.TechnologyCategoryCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TechnologyCategoryRepository extends JpaRepository<TechnologyCategory, Long> {
    Optional<TechnologyCategory> findByCode(TechnologyCategoryCode code);
}
