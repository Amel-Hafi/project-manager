package com.projectmonitor.model;

import com.projectmonitor.model.enums.AssignmentRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_assignment",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "project_id", "role"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentRole role;
}
