package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO for payment initiation response
 */
@Data
@Builder
public class PaymentInitiateResponse {
    private String checkoutUrl;
    private String paymentReference;
    private String status;
    private String message;
}
