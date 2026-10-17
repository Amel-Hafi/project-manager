package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.dto.RiskCreateDTO;
import com.projectmonitor.dto.RiskDTO;
import com.projectmonitor.dto.RiskUpdateDTO;
import com.projectmonitor.model.RiskSeverity;
import com.projectmonitor.model.RiskSource;
import com.projectmonitor.model.RiskType;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.RiskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RiskController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class RiskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RiskService riskService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void getApplicationRisks_returns200() throws Exception {
        RiskDTO dto = RiskDTO.builder()
                .id(1L)
                .applicationId(10L)
                .applicationName("App")
                .type(RiskType.SECURITY)
                .source(RiskSource.MANUAL)
                .severity(RiskSeverity.HIGH)
                .description("Test risk")
                .resolved(false)
                .build();
        when(riskService.getRisksByApplicationId(10L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/applications/10/risks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Test risk"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getProjectRisks_returns200() throws Exception {
        RiskDTO dto = RiskDTO.builder()
                .id(1L)
                .applicationId(10L)
                .applicationName("App")
                .type(RiskType.OPERATIONAL)
                .source(RiskSource.AUTO)
                .severity(RiskSeverity.MEDIUM)
                .description("Project risk")
                .resolved(false)
                .build();
        when(riskService.getRisksByProjectId(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/projects/1/risks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Project risk"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createRisk_returns201() throws Exception {
        RiskCreateDTO createDTO = new RiskCreateDTO(RiskType.SECURITY, RiskSeverity.HIGH, "New risk", null);

        RiskDTO responseDTO = RiskDTO.builder()
                .id(1L)
                .applicationId(10L)
                .applicationName("App")
                .type(RiskType.SECURITY)
                .source(RiskSource.MANUAL)
                .severity(RiskSeverity.HIGH)
                .description("New risk")
                .resolved(false)
                .build();
        when(riskService.createManualRisk(eq(10L), any(RiskCreateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/v1/applications/10/risks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.description").value("New risk"))
                .andExpect(jsonPath("$.source").value("MANUAL"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateRisk_returns200() throws Exception {
        RiskUpdateDTO updateDTO = new RiskUpdateDTO(RiskSeverity.LOW, "Updated", null, true);

        RiskDTO responseDTO = RiskDTO.builder()
                .id(100L)
                .applicationId(10L)
                .applicationName("App")
                .type(RiskType.SECURITY)
                .source(RiskSource.MANUAL)
                .severity(RiskSeverity.LOW)
                .description("Updated")
                .resolved(true)
                .build();
        when(riskService.updateRisk(eq(10L), eq(100L), any(RiskUpdateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(put("/api/v1/applications/10/risks/100")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.severity").value("LOW"))
                .andExpect(jsonPath("$.resolved").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteRisk_returns204() throws Exception {
        doNothing().when(riskService).deleteRisk(10L, 100L);

        mockMvc.perform(delete("/api/v1/applications/10/risks/100"))
                .andExpect(status().isNoContent());
    }

    @Test
    void createRisk_withoutAuth_returns401() throws Exception {
        RiskCreateDTO createDTO = new RiskCreateDTO(RiskType.SECURITY, RiskSeverity.HIGH, "New risk", null);

        mockMvc.perform(post("/api/v1/applications/10/risks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "DIRECTOR")
    void createRisk_withDirectorRole_returns403() throws Exception {
        RiskCreateDTO createDTO = new RiskCreateDTO(RiskType.SECURITY, RiskSeverity.HIGH, "New risk", null);

        mockMvc.perform(post("/api/v1/applications/10/risks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isForbidden());
    }
}
