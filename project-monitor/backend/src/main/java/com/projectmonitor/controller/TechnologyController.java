package com.projectmonitor.controller;

import com.projectmonitor.dto.TechnologyCategoryDTO;
import com.projectmonitor.dto.TechnologyItemCreateDTO;
import com.projectmonitor.dto.TechnologyItemDTO;
import com.projectmonitor.dto.TechnologyItemUpdateDTO;
import com.projectmonitor.model.enums.TechnologyCategoryCode;
import com.projectmonitor.service.TechnologyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TechnologyController {

    private final TechnologyService technologyService;

    @GetMapping("/technology-categories")
    @PreAuthorize("isAuthenticated()")
    public List<TechnologyCategoryDTO> getAllCategories() {
        return technologyService.getAllCategories();
    }

    @GetMapping("/technology-categories/{code}/items")
    @PreAuthorize("isAuthenticated()")
    public Page<TechnologyItemDTO> getItemsByCategory(
            @PathVariable TechnologyCategoryCode code,
            Pageable pageable) {
        return technologyService.getItemsByCategory(code, pageable);
    }

    @PostMapping("/technology-items")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'DT_REFERENT')")
    public TechnologyItemDTO createItem(@Valid @RequestBody TechnologyItemCreateDTO dto) {
        return technologyService.createItem(dto);
    }

    @PutMapping("/technology-items/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DT_REFERENT')")
    public TechnologyItemDTO updateItem(@PathVariable Long id, @Valid @RequestBody TechnologyItemUpdateDTO dto) {
        return technologyService.updateItem(id, dto);
    }

    @DeleteMapping("/technology-items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN', 'DT_REFERENT')")
    public void deleteItem(@PathVariable Long id) {
        technologyService.deleteItem(id);
    }

    @PatchMapping("/technology-items/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public TechnologyItemDTO deactivateItem(@PathVariable Long id) {
        return technologyService.deactivateItem(id);
    }

    @PatchMapping("/technology-items/{id}/reactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public TechnologyItemDTO reactivateItem(@PathVariable Long id) {
        return technologyService.reactivateItem(id);
    }

    @GetMapping("/technology-categories/{code}/items/active")
    @PreAuthorize("isAuthenticated()")
    public List<TechnologyItemDTO> getActiveItemsByCategory(@PathVariable TechnologyCategoryCode code) {
        return technologyService.getActiveItemsByCategory(code);
    }
}
