package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.dto.ProjectCreateDTO;
import com.projectmonitor.dto.ProjectDTO;
import com.projectmonitor.dto.ProjectUpdateDTO;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.ProjectService;
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

@WebMvcTest(ProjectController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
@WithMockUser(roles = "ADMIN")
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjectService projectService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getByClient_returns200() throws Exception {
        ProjectDTO dto = ProjectDTO.builder()
                .id(1L)
                .name("Project Alpha")
                .clientId(1L)
                .clientName("Client")
                .build();
        Pageable pageable = PageRequest.of(0, 20);
        when(projectService.getByClient(eq(1L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(dto), pageable, 1));

        mockMvc.perform(get("/api/v1/clients/1/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Project Alpha"));
    }

    @Test
    void create_returns201() throws Exception {
        ProjectCreateDTO createDTO = new ProjectCreateDTO();
        createDTO.setName("New Project");
        createDTO.setClientId(1L);

        ProjectDTO responseDTO = ProjectDTO.builder()
                .id(1L)
                .name("New Project")
                .clientId(1L)
                .clientName("Client")
                .build();
        when(projectService.create(any(ProjectCreateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Project"));
    }

    @Test
    void update_returns200() throws Exception {
        ProjectUpdateDTO updateDTO = new ProjectUpdateDTO();
        updateDTO.setName("Updated Project");

        ProjectDTO responseDTO = ProjectDTO.builder()
                .id(1L)
                .name("Updated Project")
                .clientId(1L)
                .clientName("Client")
                .build();
        when(projectService.update(eq(1L), any(ProjectUpdateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(put("/api/v1/projects/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Project"));
    }

    @Test
    void delete_returns204() throws Exception {
        doNothing().when(projectService).delete(1L);

        mockMvc.perform(delete("/api/v1/projects/1"))
                .andExpect(status().isNoContent());
    }
}
