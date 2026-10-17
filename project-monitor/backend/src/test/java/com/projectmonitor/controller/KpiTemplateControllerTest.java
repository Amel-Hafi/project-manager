package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.dto.KpiTemplateCreateDTO;
import com.projectmonitor.dto.KpiTemplateResponseDTO;
import com.projectmonitor.dto.KpiTemplateUpdateDTO;
import com.projectmonitor.model.enums.KpiDimension;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.KpiTemplateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(KpiTemplateController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class KpiTemplateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private KpiTemplateService kpiTemplateService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private Map<Integer, String> validContent() {
        Map<Integer, String> content = new HashMap<>();
        for (int i = 1; i <= 10; i++) {
            content.put(i, "Level " + i + " description");
        }
        return content;
    }

    private KpiTemplateResponseDTO buildResponseDto() {
        return KpiTemplateResponseDTO.builder()
                .id(1L)
                .dimension(KpiDimension.CODE_QUALITY)
                .version("1.0")
                .content(validContent())
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAll_returns200() throws Exception {
        when(kpiTemplateService.getAll(null)).thenReturn(List.of(buildResponseDto()));

        mockMvc.perform(get("/api/v1/kpi-templates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].dimension").value("CODE_QUALITY"));
    }

    @Test
    @WithMockUser(roles = "VIEWER")
    void getAll_authenticatedUser_returns200() throws Exception {
        when(kpiTemplateService.getAll(null)).thenReturn(List.of(buildResponseDto()));

        mockMvc.perform(get("/api/v1/kpi-templates"))
                .andExpect(status().isOk());
    }

    @Test
    void getAll_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/kpi-templates"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAll_withDimensionParam_returns200() throws Exception {
        when(kpiTemplateService.getAll(KpiDimension.CODE_QUALITY)).thenReturn(List.of(buildResponseDto()));

        mockMvc.perform(get("/api/v1/kpi-templates").param("dimension", "CODE_QUALITY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].dimension").value("CODE_QUALITY"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getById_returns200() throws Exception {
        when(kpiTemplateService.getById(1L)).thenReturn(buildResponseDto());

        mockMvc.perform(get("/api/v1/kpi-templates/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.version").value("1.0"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getActiveByDimension_returns200() throws Exception {
        when(kpiTemplateService.getActiveByDimension(KpiDimension.CODE_QUALITY)).thenReturn(buildResponseDto());

        mockMvc.perform(get("/api/v1/kpi-templates/active/CODE_QUALITY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_validDto_returns201() throws Exception {
        KpiTemplateCreateDTO createDto = new KpiTemplateCreateDTO(
                KpiDimension.CODE_QUALITY, "1.0", validContent(), true);

        when(kpiTemplateService.create(any(KpiTemplateCreateDTO.class))).thenReturn(buildResponseDto());

        mockMvc.perform(post("/api/v1/kpi-templates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.dimension").value("CODE_QUALITY"));
    }

    @Test
    @WithMockUser(roles = "VIEWER")
    void create_nonAdmin_returns403() throws Exception {
        KpiTemplateCreateDTO createDto = new KpiTemplateCreateDTO(
                KpiDimension.CODE_QUALITY, "1.0", validContent(), true);

        mockMvc.perform(post("/api/v1/kpi-templates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_invalidContent_missingLevels_returns400() throws Exception {
        Map<Integer, String> invalidContent = new HashMap<>();
        invalidContent.put(1, "Only one level");

        KpiTemplateCreateDTO createDto = new KpiTemplateCreateDTO(
                KpiDimension.CODE_QUALITY, "1.0", invalidContent, true);

        mockMvc.perform(post("/api/v1/kpi-templates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_nullDimension_returns400() throws Exception {
        KpiTemplateCreateDTO createDto = new KpiTemplateCreateDTO(
                null, "1.0", validContent(), true);

        mockMvc.perform(post("/api/v1/kpi-templates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void update_returns200() throws Exception {
        KpiTemplateUpdateDTO updateDto = new KpiTemplateUpdateDTO(
                KpiDimension.CODE_QUALITY, "2.0", validContent(), true);

        when(kpiTemplateService.update(eq(1L), any(KpiTemplateUpdateDTO.class))).thenReturn(buildResponseDto());

        mockMvc.perform(put("/api/v1/kpi-templates/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void activate_returns200() throws Exception {
        when(kpiTemplateService.activate(1L)).thenReturn(buildResponseDto());

        mockMvc.perform(patch("/api/v1/kpi-templates/1/activate"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "VIEWER")
    void activate_nonAdmin_returns403() throws Exception {
        mockMvc.perform(patch("/api/v1/kpi-templates/1/activate"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_returns204() throws Exception {
        doNothing().when(kpiTemplateService).delete(1L);

        mockMvc.perform(delete("/api/v1/kpi-templates/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "VIEWER")
    void delete_nonAdmin_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/kpi-templates/1"))
                .andExpect(status().isForbidden());
    }
}
