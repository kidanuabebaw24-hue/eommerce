package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageResponse {
    private Long id;
    private String senderName;
    private String senderEmail;
    private String content;
    private Long productId;
    private String productTitle;
    private String recipientUsername;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
