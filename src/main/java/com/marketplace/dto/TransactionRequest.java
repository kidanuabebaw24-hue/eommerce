package com.marketplace.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO for initiating a transaction
 */
@Data
public class TransactionRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String paymentMethod;
    private String notes;
}
