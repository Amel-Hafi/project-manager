package com.projectmonitor.service;

import com.projectmonitor.dto.KpiTemplateCreateDTO;
import com.projectmonitor.dto.KpiTemplateResponseDTO;
import com.projectmonitor.dto.KpiTemplateUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.KpiTemplate;
import com.projectmonitor.model.enums.KpiDimension;
import com.projectmonitor.repository.KpiTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KpiTemplateService {

    private final KpiTemplateRepository kpiTemplateRepository;

    public List<KpiTemplateResponseDTO> getAll(KpiDimension dimension) {
        List<KpiTemplate> templates;
        if (dimension == null) {
            templates = kpiTemplateRepository.findAll();
        } else {
            templates = kpiTemplateRepository.findByDimension(dimension);
        }
        return templates.stream().map(this::toDTO).toList();
    }

    public KpiTemplateResponseDTO getById(Long id) {
        return toDTO(findById(id));
    }

    public KpiTemplateResponseDTO getActiveByDimension(KpiDimension dimension) {
        return kpiTemplateRepository.findByDimensionAndActiveTrue(dimension)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("KpiTemplate", "dimension", dimension));
    }

    @Transactional
    public KpiTemplateResponseDTO create(KpiTemplateCreateDTO dto) {
        if (dto.isActive()) {
            deactivateCurrentActive(dto.getDimension());
        }

        KpiTemplate template = KpiTemplate.builder()
                .dimension(dto.getDimension())
                .version(dto.getVersion())
                .content(dto.getContent())
                .active(dto.isActive())
                .build();

        return toDTO(kpiTemplateRepository.save(template));
    }

    @Transactional
    public KpiTemplateResponseDTO update(Long id, KpiTemplateUpdateDTO dto) {
        KpiTemplate template = findById(id);

        if (dto.isActive()) {
            deactivateCurrentActive(dto.getDimension(), id);
        }

        template.setDimension(dto.getDimension());
        template.setVersion(dto.getVersion());
        template.setContent(dto.getContent());
        template.setActive(dto.isActive());

        return toDTO(kpiTemplateRepository.save(template));
    }

    @Transactional
    public KpiTemplateResponseDTO activate(Long id) {
        KpiTemplate template = findById(id);
        deactivateCurrentActive(template.getDimension(), id);
        template.setActive(true);
        return toDTO(kpiTemplateRepository.save(template));
    }

    @Transactional
    public void delete(Long id) {
        KpiTemplate template = findById(id);
        kpiTemplateRepository.delete(template);
    }

    private KpiTemplate findById(Long id) {
        return kpiTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("KpiTemplate", id));
    }

    private void deactivateCurrentActive(KpiDimension dimension) {
        deactivateCurrentActive(dimension, null);
    }

    private void deactivateCurrentActive(KpiDimension dimension, Long excludeId) {
        kpiTemplateRepository.findByDimensionAndActiveTrue(dimension)
                .ifPresent(current -> {
                    if (excludeId == null || !current.getId().equals(excludeId)) {
                        current.setActive(false);
                        kpiTemplateRepository.save(current);
                    }
                });
    }

    private KpiTemplateResponseDTO toDTO(KpiTemplate template) {
        return KpiTemplateResponseDTO.builder()
                .id(template.getId())
                .dimension(template.getDimension())
                .version(template.getVersion())
                .content(template.getContent())
                .active(template.isActive())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }
}
