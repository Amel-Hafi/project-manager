package com.projectmonitor.service;

import com.projectmonitor.dto.UserCreateDTO;
import com.projectmonitor.dto.UserDTO;
import com.projectmonitor.model.AppUser;
import com.projectmonitor.model.enums.UserRole;
import com.projectmonitor.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private AppUser user;

    @BeforeEach
    void setUp() {
        user = AppUser.builder()
                .id(1L)
                .username("jdoe")
                .email("jdoe@example.com")
                .firstName("John")
                .lastName("Doe")
                .role(UserRole.MANAGER)
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getAll_returnsPageOfUsers() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<AppUser> page = new PageImpl<>(List.of(user), pageable, 1);
        when(userRepository.findAll(pageable)).thenReturn(page);

        Page<UserDTO> result = userService.getAll(pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getUsername()).isEqualTo("jdoe");
        assertThat(result.getContent().get(0).getRole()).isEqualTo(UserRole.MANAGER);
        verify(userRepository).findAll(pageable);
    }

    @Test
    void create_savesAndReturnsUser() {
        UserCreateDTO dto = new UserCreateDTO();
        dto.setUsername("jdoe");
        dto.setEmail("jdoe@example.com");
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setRole(UserRole.MANAGER);

        when(userRepository.save(any(AppUser.class))).thenReturn(user);

        UserDTO result = userService.create(dto);

        assertThat(result.getUsername()).isEqualTo("jdoe");
        assertThat(result.getEmail()).isEqualTo("jdoe@example.com");
        assertThat(result.getRole()).isEqualTo(UserRole.MANAGER);
        verify(userRepository).save(any(AppUser.class));
    }
}
