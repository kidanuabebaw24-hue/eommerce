package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO for category analytics
 */
@Data
@Builder
public class CategoryAnalyticsResponse {
    private Long categoryId;
    private String categoryName;
    private Long productCount;
    private Long transactionCount;
    private BigDecimal totalRevenue;
    private Long favoriteCount;
    private Double averageRating;
}
