package com.projectmonitor.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    enum TestEnum {
        VALUE_A, VALUE_B, VALUE_C
    }

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
    }

    @Test
    void handleTypeMismatch_withEnumType_returns400WithAcceptedValues() {
        MethodParameter methodParameter = mock(MethodParameter.class);
        MethodArgumentTypeMismatchException ex = new MethodArgumentTypeMismatchException(
                "INVALID_CODE", TestEnum.class, "code", methodParameter, null);

        ResponseEntity<Map<String, Object>> response = handler.handleTypeMismatch(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo(400);
        assertThat(body.get("error")).isEqualTo("Bad Request");
        assertThat((String) body.get("message"))
                .contains("Invalid value 'INVALID_CODE' for parameter 'code'")
                .contains("VALUE_A")
                .contains("VALUE_B")
                .contains("VALUE_C");
        assertThat(body.get("timestamp")).isNotNull();
    }

    @Test
    void handleTypeMismatch_withNonEnumType_returns400WithoutAcceptedValues() {
        MethodParameter methodParameter = mock(MethodParameter.class);
        MethodArgumentTypeMismatchException ex = new MethodArgumentTypeMismatchException(
                "abc", Integer.class, "id", methodParameter, null);

        ResponseEntity<Map<String, Object>> response = handler.handleTypeMismatch(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo(400);
        assertThat(body.get("error")).isEqualTo("Bad Request");
        assertThat((String) body.get("message"))
                .isEqualTo("Invalid value 'abc' for parameter 'id'");
    }

    @Test
    void handleResourceNotFound_returns404() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Entity not found");

        ResponseEntity<Map<String, Object>> response = handler.handleResourceNotFound(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(404);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo(404);
        assertThat(body.get("error")).isEqualTo("Not Found");
        assertThat(body.get("message")).isEqualTo("Entity not found");
    }

    @Test
    void handleGeneric_returns500() {
        Exception ex = new RuntimeException("something went wrong");

        ResponseEntity<Map<String, Object>> response = handler.handleGeneric(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(500);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo(500);
        assertThat(body.get("error")).isEqualTo("Internal Server Error");
        assertThat(body.get("message")).isEqualTo("An unexpected error occurred");
    }
}
