package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for transaction response
 */
@Data
@Builder
public class TransactionResponse {
    private Long id;
    private Long buyerId;
    private String buyerUsername;
    private Long sellerId;
    private String sellerUsername;
    private Long productId;
    private String productTitle;
    private BigDecimal amount;
    private String status;
    private String paymentReference;
    private String paymentMethod;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
