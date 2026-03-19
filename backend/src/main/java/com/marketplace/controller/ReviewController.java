package com.marketplace.controller;

import com.marketplace.dto.RatingDistributionResponse;
import com.marketplace.dto.ReviewRequest;
import com.marketplace.dto.ReviewResponse;
import com.marketplace.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for reviews and ratings
 */
@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * Create a new review
     * POST /api/v1/reviews
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request) {
        return new ResponseEntity<>(reviewService.createReview(request), HttpStatus.CREATED);
    }

    /**
     * Get reviews for a product
     * GET /api/v1/reviews/product/{productId}
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    /**
     * Get reviews for a seller
     * GET /api/v1/reviews/seller/{sellerId}
     */
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ReviewResponse>> getSellerReviews(@PathVariable Long sellerId) {
        return ResponseEntity.ok(reviewService.getSellerReviews(sellerId));
    }

    /**
     * Get my reviews (as reviewer)
     * GET /api/v1/reviews/my-reviews
     */
    @GetMapping("/my-reviews")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReviewResponse>> getMyReviews() {
        return ResponseEntity.ok(reviewService.getMyReviews());
    }

    /**
     * Get rating distribution for product
     * GET /api/v1/reviews/product/{productId}/distribution
     */
    @GetMapping("/product/{productId}/distribution")
    public ResponseEntity<RatingDistributionResponse> getProductRatingDistribution(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductRatingDistribution(productId));
    }

    /**
     * Get rating distribution for seller
     * GET /api/v1/reviews/seller/{sellerId}/distribution
     */
    @GetMapping("/seller/{sellerId}/distribution")
    public ResponseEntity<RatingDistributionResponse> getSellerRatingDistribution(@PathVariable Long sellerId) {
        return ResponseEntity.ok(reviewService.getSellerRatingDistribution(sellerId));
    }
}
