package com.marketplace.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for advanced product search
 */
@Data
public class ProductSearchRequest {
    private Long categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String location;
    private Double minRating;
    private LocalDateTime postedAfter;
    private String status;
    private String searchTerm;
    private Integer page = 0;
    private Integer size = 20;
    private String sortBy = "createdAt";
    private String sortDirection = "DESC";
}
