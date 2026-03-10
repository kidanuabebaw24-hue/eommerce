package com.marketplace.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for revenue analytics
 */
@Data
@Builder
public class RevenueAnalyticsResponse {
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private BigDecimal weeklyRevenue;
    private BigDecimal dailyRevenue;
    private List<MonthlyRevenueData> monthlyBreakdown;
    private List<CategoryRevenueData> categoryBreakdown;

    @Data
    @Builder
    public static class MonthlyRevenueData {
        private String month;
        private BigDecimal revenue;
        private Long transactionCount;
    }

    @Data
    @Builder
    public static class CategoryRevenueData {
        private String categoryName;
        private BigDecimal revenue;
        private Long transactionCount;
    }
}
