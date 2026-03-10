package com.marketplace.controller;

import com.marketplace.dto.ServiceRequest;
import com.marketplace.dto.ServiceResponse;
import com.marketplace.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SERVICE_PROVIDER', 'ADMIN')")
    public ResponseEntity<ServiceResponse> createService(@Valid @RequestBody ServiceRequest request) {
        return new ResponseEntity<>(serviceService.createService(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(serviceService.getAllServices(page, size));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SERVICE_PROVIDER', 'ADMIN')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
