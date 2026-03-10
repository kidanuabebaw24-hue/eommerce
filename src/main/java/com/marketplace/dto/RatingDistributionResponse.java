package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

/**
 * DTO for rating distribution
 */
@Data
@Builder
public class RatingDistributionResponse {
    private Double averageRating;
    private Long totalReviews;
    private Map<Integer, Long> distribution; // {5: 100, 4: 50, 3: 20, 2: 5, 1: 2}
    private Double fiveStarPercentage;
    private Double fourStarPercentage;
    private Double threeStarPercentage;
    private Double twoStarPercentage;
    private Double oneStarPercentage;
}
