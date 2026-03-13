package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class RegistrationPaymentResponse {
    private Long id;
    private String paymentReference;
    private String email;
    private String fullName;
    private String username;
    private String userRole;
    private BigDecimal amount;
    private String status;
    private String paymentMethod;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private String checkoutUrl; // For payment gateway redirect
}
