package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.dto.ApplicationCreateDTO;
import com.projectmonitor.dto.ApplicationDTO;
import com.projectmonitor.dto.ApplicationUpdateDTO;
import com.projectmonitor.model.enums.ApplicationStatus;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.ApplicationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

@WebMvcTest(ApplicationController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
@WithMockUser(roles = "ADMIN")
class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getByProject_returns200() throws Exception {
        ApplicationDTO dto = ApplicationDTO.builder()
                .id(1L)
                .name("App")
                .status(ApplicationStatus.ACTIVE)
                .projectId(1L)
                .projectName("Project")
                .build();
        Pageable pageable = PageRequest.of(0, 20);
        when(applicationService.getByProject(eq(1L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(dto), pageable, 1));

        mockMvc.perform(get("/api/v1/projects/1/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("App"));
    }

    @Test
    void create_returns201() throws Exception {
        ApplicationCreateDTO createDTO = new ApplicationCreateDTO();
        createDTO.setName("New App");
        createDTO.setProjectId(1L);

        ApplicationDTO responseDTO = ApplicationDTO.builder()
                .id(1L)
                .name("New App")
                .status(ApplicationStatus.ACTIVE)
                .projectId(1L)
                .projectName("Project")
                .build();
        when(applicationService.create(any(ApplicationCreateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/v1/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New App"));
    }

    @Test
    void update_returns200() throws Exception {
        ApplicationUpdateDTO updateDTO = new ApplicationUpdateDTO();
        updateDTO.setName("Updated App");

        ApplicationDTO responseDTO = ApplicationDTO.builder()
                .id(1L)
                .name("Updated App")
                .status(ApplicationStatus.ACTIVE)
                .projectId(1L)
                .projectName("Project")
                .build();
        when(applicationService.update(eq(1L), any(ApplicationUpdateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(put("/api/v1/applications/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated App"));
    }

    @Test
    void delete_returns204() throws Exception {
        doNothing().when(applicationService).delete(1L);

        mockMvc.perform(delete("/api/v1/applications/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void updateTechnologies_returns200() throws Exception {
        List<Long> techIds = List.of(1L, 2L);
        ApplicationDTO responseDTO = ApplicationDTO.builder()
                .id(1L)
                .name("App")
                .status(ApplicationStatus.ACTIVE)
                .projectId(1L)
                .projectName("Project")
                .build();
        when(applicationService.updateTechnologies(eq(1L), any(List.class))).thenReturn(responseDTO);

        mockMvc.perform(put("/api/v1/applications/1/technologies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(techIds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("App"));
    }
}
