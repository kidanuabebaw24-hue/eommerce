package com.marketplace.service;

import com.marketplace.dto.ServiceRequest;
import com.marketplace.dto.ServiceResponse;
import com.marketplace.entity.Category;
import com.marketplace.entity.User;
import com.marketplace.repository.CategoryRepository;
import com.marketplace.repository.ServiceRepository;
import com.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ServiceResponse createService(ServiceRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        com.marketplace.entity.Service service = com.marketplace.entity.Service.builder()
                .serviceName(request.getServiceName())
                .description(request.getDescription())
                .price(request.getPrice())
                .location(request.getLocation())
                .provider(currentUser)
                .category(category)
                .build();

        com.marketplace.entity.Service savedService = serviceRepository.save(service);
        return mapToResponse(savedService);
    }

    public List<ServiceResponse> getAllServices(int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return serviceRepository.findAll(pageable).getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteService(Long id) {
        com.marketplace.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        validateOwnership(service);
        serviceRepository.delete(service);
    }

    private void validateOwnership(com.marketplace.entity.Service service) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!service.getProvider().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to modify this service");
        }
    }

    private ServiceResponse mapToResponse(com.marketplace.entity.Service service) {
        return ServiceResponse.builder()
                .id(service.getId())
                .serviceName(service.getServiceName())
                .description(service.getDescription())
                .price(service.getPrice())
                .location(service.getLocation())
                .providerId(service.getProvider().getId())
                .providerUsername(service.getProvider().getUsername())
                .categoryId(service.getCategory() != null ? service.getCategory().getId() : null)
                .categoryName(service.getCategory() != null ? service.getCategory().getName() : null)
                .createdAt(service.getCreatedAt())
                .build();
    }
}
