package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for payment response
 */
@Data
@Builder
public class PaymentResponse {
    private Long id;
    private Long transactionId;
    private String gatewayReference;
    private String gatewayName;
    private BigDecimal amount;
    private String currency;
    private String status;
    private Boolean isVerified;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;
}
