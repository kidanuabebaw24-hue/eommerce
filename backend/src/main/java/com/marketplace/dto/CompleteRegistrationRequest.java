package com.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompleteRegistrationRequest {
    @NotBlank(message = "Payment reference is required")
    private String paymentReference;

    @NotBlank(message = "Password is required")
    private String password;
}
