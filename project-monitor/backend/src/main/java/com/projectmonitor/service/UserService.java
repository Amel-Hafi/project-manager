package com.projectmonitor.service;

import com.projectmonitor.dto.UserCreateDTO;
import com.projectmonitor.dto.UserDTO;
import com.projectmonitor.model.AppUser;
import com.projectmonitor.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<UserDTO> getAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toDTO);
    }

    public UserDTO getById(Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new com.projectmonitor.exception.ResourceNotFoundException("User", id));
        return toDTO(user);
    }

    @Transactional
    public UserDTO create(UserCreateDTO dto) {
        AppUser user = AppUser.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .role(dto.getRole())
                .password(passwordEncoder.encode("changeme"))
                .build();
        return toDTO(userRepository.save(user));
    }

    private UserDTO toDTO(AppUser entity) {
        return UserDTO.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .role(entity.getRole())
                .active(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
