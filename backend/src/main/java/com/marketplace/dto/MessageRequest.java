package com.marketplace.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageRequest {
    
    @NotBlank(message = "Name is required")
    private String senderName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String senderEmail;
    
    @NotBlank(message = "Message content is required")
    private String content;
    
    @NotNull(message = "Product ID is required")
    private Long productId;
}
