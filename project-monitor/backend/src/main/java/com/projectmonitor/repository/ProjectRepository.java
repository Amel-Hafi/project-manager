package com.projectmonitor.repository;

import com.projectmonitor.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByClientId(Long clientId, Pageable pageable);
    Page<Project> findByClientIdAndIdIn(Long clientId, List<Long> ids, Pageable pageable);
    List<Project> findAllByClientId(Long clientId);
    List<Project> findAllByClientIdAndIdIn(Long clientId, List<Long> ids);
}
