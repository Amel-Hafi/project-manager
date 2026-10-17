package com.projectmonitor.service;

import com.projectmonitor.dto.TechnologyCategoryDTO;
import com.projectmonitor.dto.TechnologyItemCreateDTO;
import com.projectmonitor.dto.TechnologyItemDTO;
import com.projectmonitor.dto.TechnologyItemUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.TechnologyCategory;
import com.projectmonitor.model.TechnologyItem;
import com.projectmonitor.model.enums.TechnologyCategoryCode;
import com.projectmonitor.model.enums.TechnologyStatus;
import com.projectmonitor.repository.TechnologyCategoryRepository;
import com.projectmonitor.repository.TechnologyItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TechnologyService {

    private final TechnologyCategoryRepository categoryRepository;
    private final TechnologyItemRepository itemRepository;

    public List<TechnologyCategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toCategoryDTO)
                .toList();
    }

    public Page<TechnologyItemDTO> getItemsByCategory(TechnologyCategoryCode code, Pageable pageable) {
        return itemRepository.findByCategoryCode(code, pageable)
                .map(this::toItemDTO);
    }

    @Transactional
    public TechnologyItemDTO createItem(TechnologyItemCreateDTO dto) {
        TechnologyCategory category = categoryRepository.findByCode(dto.getCategoryCode())
                .orElseThrow(() -> new ResourceNotFoundException("TechnologyCategory", "code", dto.getCategoryCode()));

        TechnologyItem item = TechnologyItem.builder()
                .name(dto.getName())
                .version(dto.getVersion())
                .description(dto.getDescription())
                .status(dto.getStatus() != null ? dto.getStatus() : TechnologyStatus.ACTIVE)
                .category(category)
                .build();

        return toItemDTO(itemRepository.save(item));
    }

    @Transactional
    public TechnologyItemDTO updateItem(Long id, TechnologyItemUpdateDTO dto) {
        TechnologyItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TechnologyItem", id));

        item.setName(dto.getName());
        item.setVersion(dto.getVersion());
        item.setDescription(dto.getDescription());
        if (dto.getStatus() != null) {
            item.setStatus(dto.getStatus());
        }
        if (dto.getCategoryCode() != null) {
            TechnologyCategory category = categoryRepository.findByCode(dto.getCategoryCode())
                    .orElseThrow(() -> new ResourceNotFoundException("TechnologyCategory", "code", dto.getCategoryCode()));
            item.setCategory(category);
        }

        return toItemDTO(itemRepository.save(item));
    }

    @Transactional
    public void deleteItem(Long id) {
        TechnologyItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TechnologyItem", id));
        item.setDeleted(true);
        itemRepository.save(item);
    }

    @Transactional
    public TechnologyItemDTO deactivateItem(Long id) {
        TechnologyItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TechnologyItem", id));
        item.setStatus(TechnologyStatus.DEPRECATED);
        return toItemDTO(itemRepository.save(item));
    }

    @Transactional
    public TechnologyItemDTO reactivateItem(Long id) {
        TechnologyItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TechnologyItem", id));
        item.setStatus(TechnologyStatus.ACTIVE);
        return toItemDTO(itemRepository.save(item));
    }

    public List<TechnologyItemDTO> getActiveItemsByCategory(TechnologyCategoryCode code) {
        return itemRepository.findByCategoryCodeAndStatus(code, TechnologyStatus.ACTIVE).stream()
                .map(this::toItemDTO)
                .toList();
    }

    private TechnologyCategoryDTO toCategoryDTO(TechnologyCategory entity) {
        return TechnologyCategoryDTO.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }

    public TechnologyItemDTO toItemDTO(TechnologyItem entity) {
        return TechnologyItemDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .version(entity.getVersion())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .categoryId(entity.getCategory().getId())
                .categoryName(entity.getCategory().getName())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
