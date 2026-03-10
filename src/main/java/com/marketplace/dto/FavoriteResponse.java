package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for favorite response
 */
@Data
@Builder
public class FavoriteResponse {
    private Long id;
    private Long userId;
    private Long productId;
    private String productTitle;
    private String productDescription;
    private BigDecimal productPrice;
    private String productStatus;
    private List<String> productImages;
    private String categoryName;
    private String sellerUsername;
    private String notes;
    private LocalDateTime createdAt;
}
