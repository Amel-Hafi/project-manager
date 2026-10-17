package com.projectmonitor.repository;

import com.projectmonitor.model.TechnologyItem;
import com.projectmonitor.model.enums.TechnologyCategoryCode;
import com.projectmonitor.model.enums.TechnologyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TechnologyItemRepository extends JpaRepository<TechnologyItem, Long> {
    Page<TechnologyItem> findByCategoryCode(TechnologyCategoryCode code, Pageable pageable);
    List<TechnologyItem> findByCategoryCodeAndStatus(TechnologyCategoryCode code, TechnologyStatus status);
}
