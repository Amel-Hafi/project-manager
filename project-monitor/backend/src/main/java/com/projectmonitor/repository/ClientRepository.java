package com.projectmonitor.repository;

import com.projectmonitor.model.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {

    @Query("SELECT DISTINCT c FROM Client c JOIN c.projects p WHERE p.id IN :projectIds AND c.deleted = false")
    Page<Client> findByProjectIds(@Param("projectIds") List<Long> projectIds, Pageable pageable);

    @Query("SELECT DISTINCT c FROM Client c JOIN c.projects p WHERE p.id IN :projectIds AND c.deleted = false")
    List<Client> findDistinctByProjectIds(@Param("projectIds") List<Long> projectIds);
}
