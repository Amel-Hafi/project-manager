package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.dto.LoginRequestDTO;
import com.projectmonitor.model.AppUser;
import com.projectmonitor.model.enums.UserRole;
import com.projectmonitor.repository.AppUserRepository;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private AppUserRepository appUserRepository;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void login_success_returns200WithToken() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("admin", "admin123");

        AppUser user = AppUser.builder()
                .id(1L)
                .username("admin")
                .password("hashed")
                .email("admin@test.com")
                .firstName("Admin")
                .lastName("User")
                .role(UserRole.ADMIN)
                .active(true)
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("admin", "admin123"));
        when(appUserRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(jwtService.generateToken("admin", "ADMIN")).thenReturn("test-jwt-token");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.user.username").value("admin"))
                .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }

    @Test
    void login_wrongPassword_returns401() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("admin", "wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void login_unknownUser_returns401() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("unknown", "password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void me_authenticated_returns200() throws Exception {
        AppUser user = AppUser.builder()
                .id(1L)
                .username("admin")
                .password("hashed")
                .email("admin@test.com")
                .firstName("Admin")
                .lastName("User")
                .role(UserRole.ADMIN)
                .active(true)
                .build();

        when(appUserRepository.findByUsername("admin")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void me_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
