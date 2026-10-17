package com.projectmonitor.service;

import com.projectmonitor.dto.ClientCreateDTO;
import com.projectmonitor.dto.ClientDTO;
import com.projectmonitor.dto.ClientUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.Client;
import com.projectmonitor.repository.ClientRepository;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private ClientService clientService;

    private Client client;

    @BeforeEach
    void setUp() {
        client = Client.builder()
                .id(1L)
                .name("Test Client")
                .description("Description")
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getAll_returnsPageOfClients() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Client> page = new PageImpl<>(List.of(client), pageable, 1);
        when(authorizationService.hasUnrestrictedAccess()).thenReturn(true);
        when(clientRepository.findAll(pageable)).thenReturn(page);

        Page<ClientDTO> result = clientService.getAll(pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Test Client");
        verify(clientRepository).findAll(pageable);
    }

    @Test
    void create_savesAndReturnsClient() {
        ClientCreateDTO dto = new ClientCreateDTO();
        dto.setName("New Client");
        dto.setDescription("New Description");

        when(clientRepository.save(any(Client.class))).thenReturn(client);

        ClientDTO result = clientService.create(dto);

        assertThat(result.getName()).isEqualTo("Test Client");
        verify(clientRepository).save(any(Client.class));
    }

    @Test
    void update_existingClient_updatesAndReturns() {
        ClientUpdateDTO dto = new ClientUpdateDTO();
        dto.setName("Updated");
        dto.setDescription("Updated desc");

        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(clientRepository.save(any(Client.class))).thenReturn(client);

        ClientDTO result = clientService.update(1L, dto);

        assertThat(result).isNotNull();
        verify(clientRepository).findById(1L);
        verify(clientRepository).save(any(Client.class));
    }

    @Test
    void update_nonExistingClient_throwsException() {
        ClientUpdateDTO dto = new ClientUpdateDTO();
        dto.setName("Updated");

        when(clientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> clientService.update(99L, dto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void delete_existingClient_setsDeletedTrue() {
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(clientRepository.save(any(Client.class))).thenReturn(client);

        clientService.delete(1L);

        assertThat(client.isDeleted()).isTrue();
        verify(clientRepository).save(client);
    }

    @Test
    void delete_nonExistingClient_throwsException() {
        when(clientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> clientService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
