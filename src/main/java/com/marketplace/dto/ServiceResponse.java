package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ServiceResponse {
    private Long id;
    private String serviceName;
    private String description;
    private BigDecimal price;
    private String location;
    private Long providerId;
    private String providerUsername;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
}
