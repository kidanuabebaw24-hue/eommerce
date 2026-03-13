package com.marketplace.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for product comparison data used by AI
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductComparisonDTO {
    private Long id;
    private String title;
    private BigDecimal price;
    private String categoryName;
    private String location;
    private Double averageRating;
    private Integer reviewCount;
    private String ownerUsername;
    private String status;
}
