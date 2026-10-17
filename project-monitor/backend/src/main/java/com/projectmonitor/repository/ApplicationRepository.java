package com.projectmonitor.repository;

import com.projectmonitor.model.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Page<Application> findByProjectId(Long projectId, Pageable pageable);
}
