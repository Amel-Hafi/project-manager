package com.projectmonitor.controller;

import com.projectmonitor.config.SecurityConfig;
import com.projectmonitor.dto.ClientKpiSummaryDTO;
import com.projectmonitor.dto.GlobalDashboardDTO;
import com.projectmonitor.dto.ReferentWorkloadDTO;
import com.projectmonitor.model.TrafficLightStatus;
import com.projectmonitor.security.CustomUserDetailsService;
import com.projectmonitor.security.JwtAuthenticationFilter;
import com.projectmonitor.security.JwtService;
import com.projectmonitor.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
@WithMockUser(roles = "ADMIN")
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void getClientSummary_returns200() throws Exception {
        ClientKpiSummaryDTO dto = ClientKpiSummaryDTO.builder()
                .clientId(1L)
                .clientName("Client A")
                .averageIndustrialization(7.0)
                .averageCodeQuality(7.0)
                .averageTesting(7.0)
                .averageDeployment(7.0)
                .averageObsolescence(7.0)
                .averageAiAdoption(7.0)
                .overallAverage(7.0)
                .overallStatus(TrafficLightStatus.GREEN)
                .projectCount(2)
                .applicationCount(5)
                .projectSummaries(List.of())
                .build();

        when(dashboardService.getClientSummary(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/v1/dashboard/clients/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientId").value(1))
                .andExpect(jsonPath("$.clientName").value("Client A"))
                .andExpect(jsonPath("$.overallStatus").value("GREEN"))
                .andExpect(jsonPath("$.projectCount").value(2));
    }

    @Test
    void getGlobalDashboard_returns200() throws Exception {
        GlobalDashboardDTO dto = GlobalDashboardDTO.builder()
                .totalClients(3)
                .totalProjects(10)
                .totalApplications(25)
                .averageIndustrialization(6.5)
                .averageCodeQuality(7.0)
                .averageTesting(5.5)
                .averageDeployment(6.0)
                .averageObsolescence(5.0)
                .averageAiAdoption(4.5)
                .overallAverage(5.75)
                .overallStatus(TrafficLightStatus.YELLOW)
                .clientSummaries(List.of())
                .build();

        when(dashboardService.getGlobalDashboard()).thenReturn(dto);

        mockMvc.perform(get("/api/v1/dashboard/global"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalClients").value(3))
                .andExpect(jsonPath("$.totalProjects").value(10))
                .andExpect(jsonPath("$.overallStatus").value("YELLOW"));
    }

    @Test
    void getReferentWorkload_returns200() throws Exception {
        ReferentWorkloadDTO workload = ReferentWorkloadDTO.builder()
                .userId(1L)
                .username("john")
                .fullName("John Doe")
                .applicationCount(3)
                .projectCount(2)
                .build();

        when(dashboardService.getReferentWorkload()).thenReturn(List.of(workload));

        mockMvc.perform(get("/api/v1/dashboard/referent-workload"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(1))
                .andExpect(jsonPath("$[0].username").value("john"))
                .andExpect(jsonPath("$[0].fullName").value("John Doe"))
                .andExpect(jsonPath("$[0].applicationCount").value(3))
                .andExpect(jsonPath("$[0].projectCount").value(2));
    }
}
