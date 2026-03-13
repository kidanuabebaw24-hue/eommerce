package com.marketplace.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for price analysis data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceAnalysisDTO {
    private String categoryName;
    private BigDecimal averagePrice;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Long productCount;
    private BigDecimal medianPrice;
}
