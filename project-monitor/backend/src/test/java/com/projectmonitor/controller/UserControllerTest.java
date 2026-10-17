package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.dto.UserCreateDTO;
import com.projectmonitor.dto.UserDTO;
import com.projectmonitor.model.enums.UserRole;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.UserService;
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

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
@WithMockUser(roles = "ADMIN")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_returns200() throws Exception {
        UserDTO dto = UserDTO.builder()
                .id(1L)
                .username("jdoe")
                .email("jdoe@example.com")
                .role(UserRole.MANAGER)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();
        Pageable pageable = PageRequest.of(0, 20);
        when(userService.getAll(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(dto), pageable, 1));

        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].username").value("jdoe"));
    }

    @Test
    void create_returns201() throws Exception {
        UserCreateDTO createDTO = new UserCreateDTO();
        createDTO.setUsername("jdoe");
        createDTO.setEmail("jdoe@example.com");
        createDTO.setFirstName("John");
        createDTO.setLastName("Doe");
        createDTO.setRole(UserRole.MANAGER);

        UserDTO responseDTO = UserDTO.builder()
                .id(1L)
                .username("jdoe")
                .email("jdoe@example.com")
                .role(UserRole.MANAGER)
                .active(true)
                .build();
        when(userService.create(any(UserCreateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("jdoe"));
    }

    @Test
    void create_invalidBody_returns400() throws Exception {
        UserCreateDTO createDTO = new UserCreateDTO();
        // username is blank - should fail validation

        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isBadRequest());
    }
}
