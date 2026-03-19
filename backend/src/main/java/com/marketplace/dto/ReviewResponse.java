package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for review response
 */
@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Integer rating;
    private String comment;
    private Long reviewerId;
    private String reviewerUsername;
    private String reviewerProfilePhoto;
    private Long sellerId;
    private String sellerUsername;
    private Long productId;
    private String productTitle;
    private Long transactionId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
