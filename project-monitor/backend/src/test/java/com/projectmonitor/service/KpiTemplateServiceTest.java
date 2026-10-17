package com.projectmonitor.service;

import com.projectmonitor.dto.KpiTemplateCreateDTO;
import com.projectmonitor.dto.KpiTemplateResponseDTO;
import com.projectmonitor.dto.KpiTemplateUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.KpiTemplate;
import com.projectmonitor.model.enums.KpiDimension;
import com.projectmonitor.repository.KpiTemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KpiTemplateServiceTest {

    @Mock
    private KpiTemplateRepository kpiTemplateRepository;

    @InjectMocks
    private KpiTemplateService kpiTemplateService;

    private Map<Integer, String> validContent;
    private KpiTemplate template;

    @BeforeEach
    void setUp() {
        validContent = new HashMap<>();
        for (int i = 1; i <= 10; i++) {
            validContent.put(i, "Description for level " + i);
        }

        template = KpiTemplate.builder()
                .id(1L)
                .dimension(KpiDimension.CODE_QUALITY)
                .version("1.0")
                .content(validContent)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getAll_noDimension_returnsAll() {
        when(kpiTemplateRepository.findAll()).thenReturn(List.of(template));

        List<KpiTemplateResponseDTO> result = kpiTemplateService.getAll(null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDimension()).isEqualTo(KpiDimension.CODE_QUALITY);
        verify(kpiTemplateRepository).findAll();
    }

    @Test
    void getAll_withDimension_filtersResults() {
        when(kpiTemplateRepository.findByDimension(KpiDimension.CODE_QUALITY)).thenReturn(List.of(template));

        List<KpiTemplateResponseDTO> result = kpiTemplateService.getAll(KpiDimension.CODE_QUALITY);

        assertThat(result).hasSize(1);
        verify(kpiTemplateRepository).findByDimension(KpiDimension.CODE_QUALITY);
    }

    @Test
    void getById_existing_returnsDto() {
        when(kpiTemplateRepository.findById(1L)).thenReturn(Optional.of(template));

        KpiTemplateResponseDTO result = kpiTemplateService.getById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getVersion()).isEqualTo("1.0");
    }

    @Test
    void getById_notFound_throwsException() {
        when(kpiTemplateRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> kpiTemplateService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getActiveByDimension_found_returnsDto() {
        when(kpiTemplateRepository.findByDimensionAndActiveTrue(KpiDimension.CODE_QUALITY))
                .thenReturn(Optional.of(template));

        KpiTemplateResponseDTO result = kpiTemplateService.getActiveByDimension(KpiDimension.CODE_QUALITY);

        assertThat(result.isActive()).isTrue();
    }

    @Test
    void getActiveByDimension_notFound_throwsException() {
        when(kpiTemplateRepository.findByDimensionAndActiveTrue(KpiDimension.TESTING))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> kpiTemplateService.getActiveByDimension(KpiDimension.TESTING))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_withActiveTrue_deactivatesCurrentActive() {
        KpiTemplate existingActive = KpiTemplate.builder()
                .id(2L)
                .dimension(KpiDimension.CODE_QUALITY)
                .active(true)
                .build();

        KpiTemplateCreateDTO dto = new KpiTemplateCreateDTO(
                KpiDimension.CODE_QUALITY, "2.0", validContent, true);

        when(kpiTemplateRepository.findByDimensionAndActiveTrue(KpiDimension.CODE_QUALITY))
                .thenReturn(Optional.of(existingActive));
        when(kpiTemplateRepository.save(any(KpiTemplate.class))).thenAnswer(inv -> inv.getArgument(0));

        KpiTemplateResponseDTO result = kpiTemplateService.create(dto);

        verify(kpiTemplateRepository, times(2)).save(any(KpiTemplate.class));
        assertThat(existingActive.isActive()).isFalse();
    }

    @Test
    void create_withActiveFalse_doesNotDeactivate() {
        KpiTemplateCreateDTO dto = new KpiTemplateCreateDTO(
                KpiDimension.CODE_QUALITY, "1.0", validContent, false);

        when(kpiTemplateRepository.save(any(KpiTemplate.class))).thenAnswer(inv -> inv.getArgument(0));

        kpiTemplateService.create(dto);

        verify(kpiTemplateRepository, never()).findByDimensionAndActiveTrue(any());
        verify(kpiTemplateRepository, times(1)).save(any(KpiTemplate.class));
    }

    @Test
    void update_withActiveTrue_deactivatesCurrentActive() {
        KpiTemplate existingActive = KpiTemplate.builder()
                .id(2L)
                .dimension(KpiDimension.CODE_QUALITY)
                .active(true)
                .build();

        KpiTemplateUpdateDTO dto = new KpiTemplateUpdateDTO(
                KpiDimension.CODE_QUALITY, "2.0", validContent, true);

        when(kpiTemplateRepository.findById(1L)).thenReturn(Optional.of(template));
        when(kpiTemplateRepository.findByDimensionAndActiveTrue(KpiDimension.CODE_QUALITY))
                .thenReturn(Optional.of(existingActive));
        when(kpiTemplateRepository.save(any(KpiTemplate.class))).thenAnswer(inv -> inv.getArgument(0));

        kpiTemplateService.update(1L, dto);

        assertThat(existingActive.isActive()).isFalse();
    }

    @Test
    void activate_deactivatesCurrentAndActivatesTarget() {
        KpiTemplate existingActive = KpiTemplate.builder()
                .id(2L)
                .dimension(KpiDimension.CODE_QUALITY)
                .active(true)
                .build();

        KpiTemplate inactive = KpiTemplate.builder()
                .id(3L)
                .dimension(KpiDimension.CODE_QUALITY)
                .version("1.0")
                .content(validContent)
                .active(false)
                .build();

        when(kpiTemplateRepository.findById(3L)).thenReturn(Optional.of(inactive));
        when(kpiTemplateRepository.findByDimensionAndActiveTrue(KpiDimension.CODE_QUALITY))
                .thenReturn(Optional.of(existingActive));
        when(kpiTemplateRepository.save(any(KpiTemplate.class))).thenAnswer(inv -> inv.getArgument(0));

        KpiTemplateResponseDTO result = kpiTemplateService.activate(3L);

        assertThat(existingActive.isActive()).isFalse();
        assertThat(inactive.isActive()).isTrue();
    }

    @Test
    void delete_existing_deletesTemplate() {
        when(kpiTemplateRepository.findById(1L)).thenReturn(Optional.of(template));

        kpiTemplateService.delete(1L);

        verify(kpiTemplateRepository).delete(template);
    }

    @Test
    void delete_notFound_throwsException() {
        when(kpiTemplateRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> kpiTemplateService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
