package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.dto.ProjectAssignmentCreateDTO;
import com.projectmonitor.dto.ProjectAssignmentDTO;
import com.projectmonitor.model.enums.AssignmentRole;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.ProjectAssignmentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProjectAssignmentController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
@WithMockUser(roles = "ADMIN")
class ProjectAssignmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjectAssignmentService assignmentService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void create_returns201() throws Exception {
        ProjectAssignmentCreateDTO createDTO = new ProjectAssignmentCreateDTO();
        createDTO.setUserId(1L);
        createDTO.setProjectId(1L);
        createDTO.setRole(AssignmentRole.MANAGER);

        ProjectAssignmentDTO responseDTO = ProjectAssignmentDTO.builder()
                .id(1L)
                .userId(1L)
                .username("jdoe")
                .projectId(1L)
                .projectName("Project Alpha")
                .role(AssignmentRole.MANAGER)
                .build();
        when(assignmentService.create(any(ProjectAssignmentCreateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/v1/project-assignments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("jdoe"))
                .andExpect(jsonPath("$.role").value("MANAGER"));
    }

    @Test
    void delete_returns204() throws Exception {
        doNothing().when(assignmentService).delete(1L);

        mockMvc.perform(delete("/api/v1/project-assignments/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_invalidBody_returns400() throws Exception {
        ProjectAssignmentCreateDTO createDTO = new ProjectAssignmentCreateDTO();
        // All required fields are null - should fail validation

        mockMvc.perform(post("/api/v1/project-assignments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isBadRequest());
    }
}
