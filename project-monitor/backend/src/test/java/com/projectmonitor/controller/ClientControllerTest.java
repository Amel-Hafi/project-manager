package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.dto.ClientCreateDTO;
import com.projectmonitor.dto.ClientDTO;
import com.projectmonitor.dto.ClientUpdateDTO;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.ClientService;
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

@WebMvcTest(ClientController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
@WithMockUser(roles = "ADMIN")
class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ClientService clientService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_returns200() throws Exception {
        ClientDTO dto = ClientDTO.builder()
                .id(1L)
                .name("Client A")
                .build();
        Pageable pageable = PageRequest.of(0, 20);
        when(clientService.getAll(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(dto), pageable, 1));

        mockMvc.perform(get("/api/v1/clients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Client A"));
    }

    @Test
    void create_returns201() throws Exception {
        ClientCreateDTO createDTO = new ClientCreateDTO();
        createDTO.setName("New Client");

        ClientDTO responseDTO = ClientDTO.builder()
                .id(1L)
                .name("New Client")
                .build();
        when(clientService.create(any(ClientCreateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/v1/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Client"));
    }

    @Test
    void update_returns200() throws Exception {
        ClientUpdateDTO updateDTO = new ClientUpdateDTO();
        updateDTO.setName("Updated Client");

        ClientDTO responseDTO = ClientDTO.builder()
                .id(1L)
                .name("Updated Client")
                .build();
        when(clientService.update(eq(1L), any(ClientUpdateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(put("/api/v1/clients/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Client"));
    }

    @Test
    void delete_returns204() throws Exception {
        doNothing().when(clientService).delete(1L);

        mockMvc.perform(delete("/api/v1/clients/1"))
                .andExpect(status().isNoContent());
    }
}
