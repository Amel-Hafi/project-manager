package com.projectmonitor.controller;

import com.projectmonitor.dto.ClientCreateDTO;
import com.projectmonitor.dto.ClientDTO;
import com.projectmonitor.dto.ClientUpdateDTO;
import com.projectmonitor.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public Page<ClientDTO> getAll(Pageable pageable) {
        return clientService.getAll(pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ClientDTO getById(@PathVariable Long id) {
        return clientService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ClientDTO create(@Valid @RequestBody ClientCreateDTO dto) {
        return clientService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ClientDTO update(@PathVariable Long id, @Valid @RequestBody ClientUpdateDTO dto) {
        return clientService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public void delete(@PathVariable Long id) {
        clientService.delete(id);
    }
}
