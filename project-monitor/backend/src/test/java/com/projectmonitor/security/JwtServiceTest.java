package com.projectmonitor.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret",
                "project-monitor-jwt-secret-key-that-is-at-least-256-bits-long-for-hs256");
        ReflectionTestUtils.setField(jwtService, "expiration", 86400000L);
    }

    @Test
    void generateToken_createsValidToken() {
        String token = jwtService.generateToken("admin", "ADMIN");

        assertThat(token).isNotBlank();
        assertThat(jwtService.isTokenValid(token)).isTrue();
    }

    @Test
    void extractUsername_returnsCorrectUsername() {
        String token = jwtService.generateToken("admin", "ADMIN");

        String username = jwtService.extractUsername(token);

        assertThat(username).isEqualTo("admin");
    }

    @Test
    void extractRole_returnsCorrectRole() {
        String token = jwtService.generateToken("admin", "ADMIN");

        String role = jwtService.extractRole(token);

        assertThat(role).isEqualTo("ADMIN");
    }

    @Test
    void isTokenValid_withExpiredToken_returnsFalse() {
        JwtService shortLivedService = new JwtService();
        ReflectionTestUtils.setField(shortLivedService, "secret",
                "project-monitor-jwt-secret-key-that-is-at-least-256-bits-long-for-hs256");
        ReflectionTestUtils.setField(shortLivedService, "expiration", -1000L);

        String token = shortLivedService.generateToken("admin", "ADMIN");

        assertThat(jwtService.isTokenValid(token)).isFalse();
    }

    @Test
    void isTokenValid_withInvalidToken_returnsFalse() {
        assertThat(jwtService.isTokenValid("invalid.token.here")).isFalse();
    }
}
