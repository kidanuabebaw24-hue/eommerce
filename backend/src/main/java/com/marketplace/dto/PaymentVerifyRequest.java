package com.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for payment verification
 */
@Data
public class PaymentVerifyRequest {

    @NotBlank(message = "Payment reference is required")
    private String paymentReference;

    @NotBlank(message = "Gateway reference is required")
    private String gatewayReference;
}
