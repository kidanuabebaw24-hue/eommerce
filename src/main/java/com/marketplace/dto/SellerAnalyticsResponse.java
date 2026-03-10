package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO for seller analytics
 */
@Data
@Builder
public class SellerAnalyticsResponse {
    private Long sellerId;
    private String sellerUsername;
    private String sellerEmail;
    private Long totalProducts;
    private Long soldProducts;
    private Long totalTransactions;
    private BigDecimal totalEarnings;
    private Double averageRating;
    private Long reviewCount;
    private String verificationStatus;
}
