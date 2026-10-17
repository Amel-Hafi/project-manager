package com.projectmonitor.service;

import com.projectmonitor.dto.ClientCreateDTO;
import com.projectmonitor.dto.ClientDTO;
import com.projectmonitor.dto.ClientUpdateDTO;
import com.projectmonitor.exception.ResourceNotFoundException;
import com.projectmonitor.model.Client;
import com.projectmonitor.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClientService {

    private final ClientRepository clientRepository;
    private final AuthorizationService authorizationService;

    public Page<ClientDTO> getAll(Pageable pageable) {
        if (authorizationService.hasUnrestrictedAccess()) {
            return clientRepository.findAll(pageable).map(this::toDTO);
        }
        List<Long> projectIds = authorizationService.getAssignedProjectIds();
        if (projectIds.isEmpty()) {
            return Page.empty(pageable);
        }
        return clientRepository.findByProjectIds(projectIds, pageable).map(this::toDTO);
    }

    public ClientDTO getById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", id));
        return toDTO(client);
    }

    @Transactional
    public ClientDTO create(ClientCreateDTO dto) {
        Client client = Client.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        return toDTO(clientRepository.save(client));
    }

    @Transactional
    public ClientDTO update(Long id, ClientUpdateDTO dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", id));
        client.setName(dto.getName());
        client.setDescription(dto.getDescription());
        return toDTO(clientRepository.save(client));
    }

    @Transactional
    public void delete(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", id));
        client.setDeleted(true);
        clientRepository.save(client);
    }

    private ClientDTO toDTO(Client entity) {
        return ClientDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
