package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String location;
    private String status;
    private Long ownerId;
    private String ownerUsername;
    private Long categoryId;
    private String categoryName;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
}
