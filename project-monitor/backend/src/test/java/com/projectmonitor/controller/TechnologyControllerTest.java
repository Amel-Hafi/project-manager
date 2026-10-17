package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.dto.TechnologyCategoryDTO;
import com.projectmonitor.dto.TechnologyItemCreateDTO;
import com.projectmonitor.dto.TechnologyItemDTO;
import com.projectmonitor.dto.TechnologyItemUpdateDTO;
import com.projectmonitor.model.enums.TechnologyCategoryCode;
import com.projectmonitor.model.enums.TechnologyStatus;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.TechnologyService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TechnologyController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
@WithMockUser(roles = "ADMIN")
class TechnologyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TechnologyService technologyService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getAllCategories_returns200() throws Exception {
        TechnologyCategoryDTO dto = TechnologyCategoryDTO.builder()
                .id(1L)
                .code(TechnologyCategoryCode.PROJECT_TECH)
                .name("Technologies Projet")
                .build();
        when(technologyService.getAllCategories()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/technology-categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].code").value("PROJECT_TECH"));
    }

    @Test
    void getItemsByCategory_returns200() throws Exception {
        TechnologyItemDTO dto = TechnologyItemDTO.builder()
                .id(1L)
                .name("Java")
                .version("21")
                .status(TechnologyStatus.ACTIVE)
                .categoryId(1L)
                .categoryName("Technologies Projet")
                .build();
        Pageable pageable = PageRequest.of(0, 20);
        when(technologyService.getItemsByCategory(eq(TechnologyCategoryCode.PROJECT_TECH), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(dto), pageable, 1));

        mockMvc.perform(get("/api/v1/technology-categories/PROJECT_TECH/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Java"));
    }

    @Test
    void createItem_returns201() throws Exception {
        TechnologyItemCreateDTO createDTO = new TechnologyItemCreateDTO();
        createDTO.setName("Spring");
        createDTO.setVersion("3.3");
        createDTO.setCategoryCode(TechnologyCategoryCode.PROJECT_TECH);

        TechnologyItemDTO responseDTO = TechnologyItemDTO.builder()
                .id(1L)
                .name("Spring")
                .version("3.3")
                .status(TechnologyStatus.ACTIVE)
                .categoryId(1L)
                .categoryName("Technologies Projet")
                .createdAt(LocalDateTime.now())
                .build();
        when(technologyService.createItem(any(TechnologyItemCreateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/v1/technology-items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Spring"));
    }

    @Test
    void updateItem_returns200() throws Exception {
        TechnologyItemUpdateDTO updateDTO = new TechnologyItemUpdateDTO();
        updateDTO.setName("Java Updated");
        updateDTO.setVersion("22");

        TechnologyItemDTO responseDTO = TechnologyItemDTO.builder()
                .id(1L)
                .name("Java Updated")
                .version("22")
                .status(TechnologyStatus.ACTIVE)
                .categoryId(1L)
                .categoryName("Technologies Projet")
                .build();
        when(technologyService.updateItem(eq(1L), any(TechnologyItemUpdateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(put("/api/v1/technology-items/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Java Updated"));
    }

    @Test
    void deleteItem_returns204() throws Exception {
        doNothing().when(technologyService).deleteItem(1L);

        mockMvc.perform(delete("/api/v1/technology-items/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deactivateItem_returns200() throws Exception {
        TechnologyItemDTO responseDTO = TechnologyItemDTO.builder()
                .id(1L)
                .name("Java")
                .version("21")
                .status(TechnologyStatus.DEPRECATED)
                .categoryId(1L)
                .categoryName("Technologies Projet")
                .build();
        when(technologyService.deactivateItem(1L)).thenReturn(responseDTO);

        mockMvc.perform(patch("/api/v1/technology-items/1/deactivate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DEPRECATED"));
    }

    @Test
    void reactivateItem_returns200() throws Exception {
        TechnologyItemDTO responseDTO = TechnologyItemDTO.builder()
                .id(1L)
                .name("Java")
                .version("21")
                .status(TechnologyStatus.ACTIVE)
                .categoryId(1L)
                .categoryName("Technologies Projet")
                .build();
        when(technologyService.reactivateItem(1L)).thenReturn(responseDTO);

        mockMvc.perform(patch("/api/v1/technology-items/1/reactivate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void getActiveItemsByCategory_returns200() throws Exception {
        TechnologyItemDTO dto = TechnologyItemDTO.builder()
                .id(1L)
                .name("Java")
                .version("21")
                .status(TechnologyStatus.ACTIVE)
                .categoryId(1L)
                .categoryName("Technologies Projet")
                .build();
        when(technologyService.getActiveItemsByCategory(TechnologyCategoryCode.PROJECT_TECH))
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/technology-categories/PROJECT_TECH/items/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Java"))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void deactivateItem_forbiddenForNonAdmin() throws Exception {
        mockMvc.perform(patch("/api/v1/technology-items/1/deactivate"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "USER")
    void reactivateItem_forbiddenForNonAdmin() throws Exception {
        mockMvc.perform(patch("/api/v1/technology-items/1/reactivate"))
                .andExpect(status().isForbidden());
    }
}
