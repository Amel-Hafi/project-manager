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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TechnologyServiceTest {

    @Mock
    private TechnologyCategoryRepository categoryRepository;

    @Mock
    private TechnologyItemRepository itemRepository;

    @InjectMocks
    private TechnologyService technologyService;

    private TechnologyCategory category;
    private TechnologyItem item;

    @BeforeEach
    void setUp() {
        category = TechnologyCategory.builder()
                .id(1L)
                .code(TechnologyCategoryCode.PROJECT_TECH)
                .name("Technologies Projet")
                .description("Project technologies")
                .build();

        item = TechnologyItem.builder()
                .id(1L)
                .name("Java")
                .version("21")
                .description("Java language")
                .status(TechnologyStatus.ACTIVE)
                .category(category)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getAllCategories_returnsList() {
        when(categoryRepository.findAll()).thenReturn(List.of(category));

        List<TechnologyCategoryDTO> result = technologyService.getAllCategories();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo(TechnologyCategoryCode.PROJECT_TECH);
        assertThat(result.get(0).getName()).isEqualTo("Technologies Projet");
    }

    @Test
    void getItemsByCategory_returnsPage() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<TechnologyItem> page = new PageImpl<>(List.of(item), pageable, 1);
        when(itemRepository.findByCategoryCode(TechnologyCategoryCode.PROJECT_TECH, pageable)).thenReturn(page);

        Page<TechnologyItemDTO> result = technologyService.getItemsByCategory(TechnologyCategoryCode.PROJECT_TECH, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Java");
    }

    @Test
    void createItem_success() {
        TechnologyItemCreateDTO dto = new TechnologyItemCreateDTO();
        dto.setName("Spring");
        dto.setVersion("3.3");
        dto.setDescription("Spring Framework");
        dto.setStatus(TechnologyStatus.ACTIVE);
        dto.setCategoryCode(TechnologyCategoryCode.PROJECT_TECH);

        when(categoryRepository.findByCode(TechnologyCategoryCode.PROJECT_TECH)).thenReturn(Optional.of(category));
        when(itemRepository.save(any(TechnologyItem.class))).thenReturn(item);

        TechnologyItemDTO result = technologyService.createItem(dto);

        assertThat(result.getName()).isEqualTo("Java");
        verify(itemRepository).save(any(TechnologyItem.class));
    }

    @Test
    void createItem_categoryNotFound_throws() {
        TechnologyItemCreateDTO dto = new TechnologyItemCreateDTO();
        dto.setName("Spring");
        dto.setCategoryCode(TechnologyCategoryCode.PROJECT_TECH);

        when(categoryRepository.findByCode(TechnologyCategoryCode.PROJECT_TECH)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> technologyService.createItem(dto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateItem_success() {
        TechnologyItemUpdateDTO dto = new TechnologyItemUpdateDTO();
        dto.setName("Java Updated");
        dto.setVersion("22");
        dto.setDescription("Updated");
        dto.setStatus(TechnologyStatus.ACTIVE);

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(itemRepository.save(any(TechnologyItem.class))).thenReturn(item);

        TechnologyItemDTO result = technologyService.updateItem(1L, dto);

        assertThat(result).isNotNull();
        verify(itemRepository).save(any(TechnologyItem.class));
    }

    @Test
    void updateItem_withCategoryChange() {
        TechnologyItemUpdateDTO dto = new TechnologyItemUpdateDTO();
        dto.setName("Java");
        dto.setVersion("21");
        dto.setCategoryCode(TechnologyCategoryCode.PROJECT_TECH);

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(categoryRepository.findByCode(TechnologyCategoryCode.PROJECT_TECH)).thenReturn(Optional.of(category));
        when(itemRepository.save(any(TechnologyItem.class))).thenReturn(item);

        TechnologyItemDTO result = technologyService.updateItem(1L, dto);

        assertThat(result).isNotNull();
    }

    @Test
    void updateItem_notFound_throws() {
        TechnologyItemUpdateDTO dto = new TechnologyItemUpdateDTO();
        dto.setName("Java");

        when(itemRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> technologyService.updateItem(99L, dto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteItem_success() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(itemRepository.save(any(TechnologyItem.class))).thenReturn(item);

        technologyService.deleteItem(1L);

        verify(itemRepository).save(any(TechnologyItem.class));
    }

    @Test
    void deleteItem_notFound_throws() {
        when(itemRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> technologyService.deleteItem(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deactivateItem_setsStatusToDeprecated() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(itemRepository.save(any(TechnologyItem.class))).thenAnswer(inv -> inv.getArgument(0));

        TechnologyItemDTO result = technologyService.deactivateItem(1L);

        assertThat(result.getStatus()).isEqualTo(TechnologyStatus.DEPRECATED);
        verify(itemRepository).save(any(TechnologyItem.class));
    }

    @Test
    void deactivateItem_notFound_throws() {
        when(itemRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> technologyService.deactivateItem(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void reactivateItem_setsStatusToActive() {
        item.setStatus(TechnologyStatus.DEPRECATED);
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));
        when(itemRepository.save(any(TechnologyItem.class))).thenAnswer(inv -> inv.getArgument(0));

        TechnologyItemDTO result = technologyService.reactivateItem(1L);

        assertThat(result.getStatus()).isEqualTo(TechnologyStatus.ACTIVE);
        verify(itemRepository).save(any(TechnologyItem.class));
    }

    @Test
    void reactivateItem_notFound_throws() {
        when(itemRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> technologyService.reactivateItem(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getActiveItemsByCategory_returnsOnlyActiveItems() {
        TechnologyItem deprecatedItem = TechnologyItem.builder()
                .id(2L)
                .name("Legacy")
                .version("1.0")
                .status(TechnologyStatus.DEPRECATED)
                .category(category)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(itemRepository.findByCategoryCodeAndStatus(TechnologyCategoryCode.PROJECT_TECH, TechnologyStatus.ACTIVE))
                .thenReturn(List.of(item));

        List<TechnologyItemDTO> result = technologyService.getActiveItemsByCategory(TechnologyCategoryCode.PROJECT_TECH);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Java");
        assertThat(result.get(0).getStatus()).isEqualTo(TechnologyStatus.ACTIVE);
    }
}
