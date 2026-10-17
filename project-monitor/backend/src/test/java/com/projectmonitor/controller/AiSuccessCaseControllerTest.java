package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.dto.AiSuccessCaseCreateDTO;
import com.projectmonitor.dto.AiSuccessCaseDTO;
import com.projectmonitor.dto.AiSuccessCaseUpdateDTO;
import com.projectmonitor.model.AiCaseStatus;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.AiSuccessCaseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiSuccessCaseController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
@WithMockUser(roles = "ADMIN")
class AiSuccessCaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AiSuccessCaseService aiSuccessCaseService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getByApplication_returns200() throws Exception {
        AiSuccessCaseDTO dto = AiSuccessCaseDTO.builder()
                .id(1L)
                .applicationId(10L)
                .applicationName("App")
                .title("AI Case")
                .tool("Copilot")
                .profile("Developer")
                .status(AiCaseStatus.PENDING)
                .build();
        when(aiSuccessCaseService.getByApplication(10L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/applications/10/ai-success-cases"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("AI Case"));
    }

    @Test
    void create_returns201() throws Exception {
        AiSuccessCaseCreateDTO createDTO = new AiSuccessCaseCreateDTO();
        createDTO.setTitle("New Case");
        createDTO.setTool("Copilot");
        createDTO.setProfile("Developer");

        AiSuccessCaseDTO responseDTO = AiSuccessCaseDTO.builder()
                .id(1L)
                .applicationId(10L)
                .title("New Case")
                .tool("Copilot")
                .profile("Developer")
                .status(AiCaseStatus.PENDING)
                .build();
        when(aiSuccessCaseService.create(eq(10L), any(AiSuccessCaseCreateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/v1/applications/10/ai-success-cases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Case"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void create_withMissingTitle_returns400() throws Exception {
        AiSuccessCaseCreateDTO createDTO = new AiSuccessCaseCreateDTO();
        createDTO.setTool("Copilot");
        createDTO.setProfile("Developer");

        mockMvc.perform(post("/api/v1/applications/10/ai-success-cases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_returns200() throws Exception {
        AiSuccessCaseUpdateDTO updateDTO = new AiSuccessCaseUpdateDTO();
        updateDTO.setTitle("Updated Title");

        AiSuccessCaseDTO responseDTO = AiSuccessCaseDTO.builder()
                .id(1L)
                .applicationId(10L)
                .title("Updated Title")
                .tool("Copilot")
                .profile("Developer")
                .status(AiCaseStatus.PENDING)
                .build();
        when(aiSuccessCaseService.update(eq(1L), any(AiSuccessCaseUpdateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(put("/api/v1/ai-success-cases/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void validate_returns200() throws Exception {
        AiSuccessCaseDTO responseDTO = AiSuccessCaseDTO.builder()
                .id(1L)
                .applicationId(10L)
                .title("AI Case")
                .status(AiCaseStatus.VALIDATED)
                .build();
        when(aiSuccessCaseService.validate(1L)).thenReturn(responseDTO);

        mockMvc.perform(patch("/api/v1/ai-success-cases/1/validate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("VALIDATED"));
    }

    @Test
    void delete_returns204() throws Exception {
        doNothing().when(aiSuccessCaseService).delete(1L);

        mockMvc.perform(delete("/api/v1/ai-success-cases/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "DT_REFERENT")
    void delete_withoutAdmin_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/ai-success-cases/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAll_returns200() throws Exception {
        AiSuccessCaseDTO dto = AiSuccessCaseDTO.builder()
                .id(1L)
                .applicationId(10L)
                .title("AI Case")
                .status(AiCaseStatus.PENDING)
                .build();
        when(aiSuccessCaseService.getAll(null)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/ai-success-cases"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("AI Case"));
    }

    @Test
    void getAll_withStatusFilter_returns200() throws Exception {
        when(aiSuccessCaseService.getAll(AiCaseStatus.VALIDATED)).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/ai-success-cases").param("status", "VALIDATED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(roles = "USER")
    void create_withUserRole_returns403() throws Exception {
        AiSuccessCaseCreateDTO createDTO = new AiSuccessCaseCreateDTO();
        createDTO.setTitle("Case");
        createDTO.setTool("Copilot");
        createDTO.setProfile("Developer");

        mockMvc.perform(post("/api/v1/applications/10/ai-success-cases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "USER")
    void validate_withUserRole_returns403() throws Exception {
        mockMvc.perform(patch("/api/v1/ai-success-cases/1/validate"))
                .andExpect(status().isForbidden());
    }
}
