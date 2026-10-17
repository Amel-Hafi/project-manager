package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.dto.MaturityKpiDTO;
import com.projectmonitor.dto.MaturityKpiUpdateDTO;
import com.projectmonitor.dto.ProjectKpiSummaryDTO;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.MaturityKpiService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MaturityKpiController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
@WithMockUser(roles = "ADMIN")
class MaturityKpiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MaturityKpiService maturityKpiService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getByApplication_returns200() throws Exception {
        MaturityKpiDTO dto = MaturityKpiDTO.builder()
                .id(1L)
                .applicationId(10L)
                .applicationName("App One")
                .industrialization(7)
                .codeQuality(8)
                .testing(6)
                .deployment(9)
                .obsolescence(5)
                .aiAdoption(4)
                .updatedAt(LocalDateTime.now())
                .build();

        when(maturityKpiService.getByApplication(10L)).thenReturn(dto);

        mockMvc.perform(get("/api/v1/applications/10/kpis"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.applicationId").value(10))
                .andExpect(jsonPath("$.industrialization").value(7));
    }

    @Test
    void updateKpis_returns200() throws Exception {
        MaturityKpiUpdateDTO updateDTO = new MaturityKpiUpdateDTO();
        updateDTO.setIndustrialization(7);
        updateDTO.setCodeQuality(8);
        updateDTO.setTesting(6);
        updateDTO.setDeployment(9);
        updateDTO.setObsolescence(5);
        updateDTO.setAiAdoption(4);

        MaturityKpiDTO responseDTO = MaturityKpiDTO.builder()
                .id(1L)
                .applicationId(10L)
                .applicationName("App One")
                .industrialization(7)
                .codeQuality(8)
                .testing(6)
                .deployment(9)
                .obsolescence(5)
                .aiAdoption(4)
                .updatedAt(LocalDateTime.now())
                .build();

        when(maturityKpiService.createOrUpdate(eq(10L), any(MaturityKpiUpdateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(put("/api/v1/applications/10/kpis")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.industrialization").value(7));
    }

    @Test
    void updateKpis_withInvalidValues_returns400() throws Exception {
        MaturityKpiUpdateDTO updateDTO = new MaturityKpiUpdateDTO();
        updateDTO.setIndustrialization(11); // out of range
        updateDTO.setCodeQuality(0); // out of range
        updateDTO.setTesting(6);
        updateDTO.setDeployment(9);
        updateDTO.setObsolescence(5);
        updateDTO.setAiAdoption(4);

        mockMvc.perform(put("/api/v1/applications/10/kpis")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getProjectSummary_returns200() throws Exception {
        ProjectKpiSummaryDTO summaryDTO = ProjectKpiSummaryDTO.builder()
                .projectId(1L)
                .projectName("Project Alpha")
                .averageIndustrialization(5.0)
                .averageCodeQuality(6.0)
                .averageTesting(4.0)
                .averageDeployment(7.0)
                .averageObsolescence(6.0)
                .averageAiAdoption(5.0)
                .applicationCount(2)
                .applicationKpis(List.of())
                .build();

        when(maturityKpiService.getProjectSummary(1L)).thenReturn(summaryDTO);

        mockMvc.perform(get("/api/v1/projects/1/kpis/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectId").value(1))
                .andExpect(jsonPath("$.projectName").value("Project Alpha"))
                .andExpect(jsonPath("$.averageIndustrialization").value(5.0))
                .andExpect(jsonPath("$.applicationCount").value(2));
    }

    @Test
    @WithMockUser(roles = "VIEWER")
    void updateKpis_withViewerRole_returns403() throws Exception {
        MaturityKpiUpdateDTO updateDTO = new MaturityKpiUpdateDTO();
        updateDTO.setIndustrialization(7);
        updateDTO.setCodeQuality(8);
        updateDTO.setTesting(6);
        updateDTO.setDeployment(9);
        updateDTO.setObsolescence(5);
        updateDTO.setAiAdoption(4);

        mockMvc.perform(put("/api/v1/applications/10/kpis")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isForbidden());
    }
}
