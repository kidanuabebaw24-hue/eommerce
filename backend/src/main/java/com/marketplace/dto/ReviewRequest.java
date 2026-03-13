package com.marketplace.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO for creating/updating a review
 */
@Data
public class ReviewRequest {

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @NotBlank(message = "Comment is required")
    @Size(min = 10, max = 1000, message = "Comment must be between 10 and 1000 characters")
    private String comment;

    @NotNull(message = "Product ID is required")
    private Long productId;

    private Long transactionId;
}
