package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO for admin analytics overview
 */
@Data
@Builder
public class AnalyticsOverviewResponse {
    private Long totalUsers;
    private Long totalProducts;
    private Long totalTransactions;
    private Long successfulTransactions;
    private Long pendingTransactions;
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private Long totalReviews;
    private Double averagePlatformRating;
    private Long verifiedSellers;
    private Long activeBuyers;
}
