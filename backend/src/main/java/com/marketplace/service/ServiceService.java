package com.marketplace.service;

import com.marketplace.dto.ServiceRequest;
import com.marketplace.dto.ServiceResponse;
import com.marketplace.entity.Category;
import com.marketplace.entity.ProductImage;
import com.marketplace.repository.CategoryRepository;
import com.marketplace.repository.ServiceRepository;
import com.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public ServiceResponse createService(ServiceRequest request, MultipartFile[] images) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        com.marketplace.entity.User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        com.marketplace.entity.Service service = com.marketplace.entity.Service.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .location(request.getLocation())
                .provider(currentUser)
                .category(category)
                .status(com.marketplace.entity.Service.ServiceStatus.AVAILABLE)
                .build();

        if (images != null && images.length > 0) {
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    String fileName = fileStorageService.storeFile(file);
                    ProductImage serviceImage = ProductImage.builder()
                            .imageUrl("/uploads/" + fileName)
                            .service(service)
                            .build();
                    service.getImages().add(serviceImage);
                }
            }
        }

        com.marketplace.entity.Service savedService = serviceRepository.save(service);
        return mapToResponse(savedService);
    }

    public List<ServiceResponse> getAllServices(int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return serviceRepository.findAll(pageable).getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ServiceResponse> getServicesByProvider(String username) {
        com.marketplace.entity.User provider = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return serviceRepository.findByProvider(provider).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ServiceResponse getServiceById(Long id) {
        com.marketplace.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        return mapToResponse(service);
    }

    @Transactional
    public ServiceResponse updateService(Long id, ServiceRequest request) {
        com.marketplace.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        validateOwnership(service);

        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setLocation(request.getLocation());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            service.setCategory(category);
        }

        return mapToResponse(serviceRepository.save(service));
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
                .title(service.getTitle())
                .description(service.getDescription())
                .price(service.getPrice())
                .location(service.getLocation())
                .status(service.getStatus().name())
                .providerId(service.getProvider().getId())
                .providerUsername(service.getProvider().getUsername())
                .categoryId(service.getCategory() != null ? service.getCategory().getId() : null)
                .categoryName(service.getCategory() != null ? service.getCategory().getName() : null)
                .imageUrls(service.getImages().stream().map(img -> img.getImageUrl()).collect(Collectors.toList()))
                .createdAt(service.getCreatedAt())
                .build();
    }
}
