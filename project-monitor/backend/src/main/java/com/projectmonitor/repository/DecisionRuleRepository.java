package com.projectmonitor.repository;

import com.projectmonitor.model.DecisionRule;
import com.projectmonitor.model.enums.AggregationLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DecisionRuleRepository extends JpaRepository<DecisionRule, Long> {
    List<DecisionRule> findByActiveTrue();
    List<DecisionRule> findByActiveTrueAndAggregationLevel(AggregationLevel level);
}
