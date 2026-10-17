package com.projectmonitor.dto;

import com.projectmonitor.model.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserCreateDTO {
    @NotBlank
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    @NotNull
    private UserRole role;
}
