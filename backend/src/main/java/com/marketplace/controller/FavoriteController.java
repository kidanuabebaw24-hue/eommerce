package com.marketplace.controller;

import com.marketplace.dto.FavoriteResponse;
import com.marketplace.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for favorites/wishlist
 */
@RestController
@RequestMapping("/api/v1/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * Add product to favorites
     * POST /api/v1/favorites/{productId}
     */
    @PostMapping("/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FavoriteResponse> addToFavorites(@PathVariable Long productId) {
        return new ResponseEntity<>(favoriteService.addToFavorites(productId), HttpStatus.CREATED);
    }

    /**
     * Remove product from favorites
     * DELETE /api/v1/favorites/{productId}
     */
    @DeleteMapping("/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeFromFavorites(@PathVariable Long productId) {
        favoriteService.removeFromFavorites(productId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get my favorites
     * GET /api/v1/favorites
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FavoriteResponse>> getMyFavorites() {
        return ResponseEntity.ok(favoriteService.getMyFavorites());
    }

    /**
     * Check if product is favorited
     * GET /api/v1/favorites/{productId}/check
     */
    @GetMapping("/{productId}/check")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isFavorited(@PathVariable Long productId) {
        return ResponseEntity.ok(favoriteService.isFavorited(productId));
    }

    /**
     * Get favorite count for product
     * GET /api/v1/favorites/{productId}/count
     */
    @GetMapping("/{productId}/count")
    public ResponseEntity<Long> getFavoriteCount(@PathVariable Long productId) {
        return ResponseEntity.ok(favoriteService.getFavoriteCount(productId));
    }
}
