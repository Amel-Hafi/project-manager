package com.projectmonitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.dto.DecisionRuleCreateDTO;
import com.projectmonitor.dto.DecisionRuleDTO;
import com.projectmonitor.dto.DecisionRuleUpdateDTO;
import com.projectmonitor.dto.EvaluationResultDTO;
import com.projectmonitor.model.TrafficLightStatus;
import com.projectmonitor.model.enums.AggregationLevel;
import com.projectmonitor.model.enums.ConditionType;
import com.projectmonitor.model.enums.KpiDimension;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.DecisionRuleService;
import com.projectmonitor.service.TrafficLightEvaluationService;
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

@WebMvcTest(DecisionRuleController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class DecisionRuleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DecisionRuleService decisionRuleService;

    @MockBean
    private TrafficLightEvaluationService trafficLightEvaluationService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private DecisionRuleDTO buildDto() {
        return DecisionRuleDTO.builder()
                .id(1L)
                .name("Test Rule")
                .description("Test description")
                .dimension(KpiDimension.CODE_QUALITY)
                .conditionType(ConditionType.VALUE_BELOW_THRESHOLD)
                .threshold(5.0)
                .aggregationLevel(AggregationLevel.APPLICATION)
                .trafficLightResult(TrafficLightStatus.RED)
                .active(true)
                .build();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAll_returns200() throws Exception {
        when(decisionRuleService.getAll()).thenReturn(List.of(buildDto()));

        mockMvc.perform(get("/api/v1/decision-rules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Rule"));
    }

    @Test
    @WithMockUser(roles = "VIEWER")
    void getAll_authenticatedUser_returns200() throws Exception {
        when(decisionRuleService.getAll()).thenReturn(List.of(buildDto()));

        mockMvc.perform(get("/api/v1/decision-rules"))
                .andExpect(status().isOk());
    }

    @Test
    void getAll_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/decision-rules"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getById_returns200() throws Exception {
        when(decisionRuleService.getById(1L)).thenReturn(buildDto());

        mockMvc.perform(get("/api/v1/decision-rules/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Rule"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_validDto_returns201() throws Exception {
        DecisionRuleCreateDTO createDto = new DecisionRuleCreateDTO();
        createDto.setName("New Rule");
        createDto.setConditionType(ConditionType.VALUE_BELOW_THRESHOLD);
        createDto.setThreshold(5.0);
        createDto.setAggregationLevel(AggregationLevel.APPLICATION);
        createDto.setTrafficLightResult(TrafficLightStatus.RED);

        when(decisionRuleService.create(any(DecisionRuleCreateDTO.class))).thenReturn(buildDto());

        mockMvc.perform(post("/api/v1/decision-rules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Rule"));
    }

    @Test
    @WithMockUser(roles = "VIEWER")
    void create_nonAdmin_returns403() throws Exception {
        DecisionRuleCreateDTO createDto = new DecisionRuleCreateDTO();
        createDto.setName("New Rule");
        createDto.setConditionType(ConditionType.VALUE_BELOW_THRESHOLD);
        createDto.setThreshold(5.0);
        createDto.setAggregationLevel(AggregationLevel.APPLICATION);
        createDto.setTrafficLightResult(TrafficLightStatus.RED);

        mockMvc.perform(post("/api/v1/decision-rules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void update_returns200() throws Exception {
        DecisionRuleUpdateDTO updateDto = new DecisionRuleUpdateDTO();
        updateDto.setName("Updated Rule");

        when(decisionRuleService.update(eq(1L), any(DecisionRuleUpdateDTO.class))).thenReturn(buildDto());

        mockMvc.perform(put("/api/v1/decision-rules/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void activate_returns200() throws Exception {
        when(decisionRuleService.activate(1L)).thenReturn(buildDto());

        mockMvc.perform(patch("/api/v1/decision-rules/1/activate"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deactivate_returns200() throws Exception {
        when(decisionRuleService.deactivate(1L)).thenReturn(buildDto());

        mockMvc.perform(patch("/api/v1/decision-rules/1/deactivate"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_returns204() throws Exception {
        doNothing().when(decisionRuleService).delete(1L);

        mockMvc.perform(delete("/api/v1/decision-rules/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "VIEWER")
    void delete_nonAdmin_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/decision-rules/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void evaluate_returns200() throws Exception {
        EvaluationResultDTO resultDto = EvaluationResultDTO.builder()
                .evaluated(10)
                .risksCreated(2)
                .risksResolved(1)
                .build();

        when(trafficLightEvaluationService.evaluateAll()).thenReturn(resultDto);

        mockMvc.perform(post("/api/v1/decision-rules/evaluate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.evaluated").value(10))
                .andExpect(jsonPath("$.risksCreated").value(2))
                .andExpect(jsonPath("$.risksResolved").value(1));
    }
}
