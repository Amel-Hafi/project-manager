package com.projectmonitor.model;

import com.projectmonitor.model.enums.TechnologyCategoryCode;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "technology_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnologyCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private TechnologyCategoryCode code;

    @Column(nullable = false)
    private String name;

    private String description;
}
