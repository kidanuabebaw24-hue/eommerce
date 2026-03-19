package com.marketplace.controller;

import com.marketplace.dto.AnalyticsOverviewResponse;
import com.marketplace.dto.CategoryAnalyticsResponse;
import com.marketplace.dto.RevenueAnalyticsResponse;
import com.marketplace.dto.SellerAnalyticsResponse;
import com.marketplace.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for analytics (Admin only)
 */
@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Get admin dashboard overview
     * GET /api/v1/analytics/overview
     */
    @GetMapping("/overview")
    public ResponseEntity<AnalyticsOverviewResponse> getOverview() {
        return ResponseEntity.ok(analyticsService.getOverview());
    }

    /**
     * Get revenue analytics
     * GET /api/v1/analytics/revenue
     */
    @GetMapping("/revenue")
    public ResponseEntity<RevenueAnalyticsResponse> getRevenueAnalytics() {
        return ResponseEntity.ok(analyticsService.getRevenueAnalytics());
    }

    /**
     * Get category analytics
     * GET /api/v1/analytics/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryAnalyticsResponse>> getCategoryAnalytics() {
        return ResponseEntity.ok(analyticsService.getCategoryAnalytics());
    }

    /**
     * Get top sellers
     * GET /api/v1/analytics/top-sellers?limit=10
     */
    @GetMapping("/top-sellers")
    public ResponseEntity<List<SellerAnalyticsResponse>> getTopSellers(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(analyticsService.getTopSellers(limit));
    }
}
