package com.marketplace.service;

import com.marketplace.dto.FavoriteResponse;
import com.marketplace.entity.Favorite;
import com.marketplace.entity.Product;
import com.marketplace.entity.User;
import com.marketplace.repository.FavoriteRepository;
import com.marketplace.repository.ProductRepository;
import com.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for favorite/wishlist management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    /**
     * Add product to favorites
     */
    @Transactional
    public FavoriteResponse addToFavorites(Long productId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if already favorited
        if (favoriteRepository.existsByUserAndProduct(user, product)) {
            throw new RuntimeException("Product already in favorites");
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .product(product)
                .build();

        Favorite savedFavorite = favoriteRepository.save(favorite);
        log.info("Product {} added to favorites by {}", productId, username);

        return mapToResponse(savedFavorite);
    }

    /**
     * Remove product from favorites
     */
    @Transactional
    public void removeFromFavorites(Long productId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        favoriteRepository.deleteByUserAndProduct(user, product);
        log.info("Product {} removed from favorites by {}", productId, username);
    }

    /**
     * Get user's favorites
     */
    public List<FavoriteResponse> getMyFavorites() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return favoriteRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Check if product is favorited by current user
     */
    public boolean isFavorited(Long productId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return favoriteRepository.existsByUserAndProduct(user, product);
    }

    /**
     * Get favorite count for product
     */
    public Long getFavoriteCount(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return favoriteRepository.countByProduct(product);
    }

    /**
     * Map entity to response DTO
     */
    private FavoriteResponse mapToResponse(Favorite favorite) {
        Product product = favorite.getProduct();
        
        return FavoriteResponse.builder()
                .id(favorite.getId())
                .userId(favorite.getUser().getId())
                .productId(product.getId())
                .productTitle(product.getTitle())
                .productDescription(product.getDescription())
                .productPrice(product.getPrice())
                .productStatus(product.getStatus().name())
                .productImages(product.getImages().stream()
                        .map(img -> img.getImageUrl())
                        .collect(Collectors.toList()))
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .sellerUsername(product.getOwner().getUsername())
                .notes(favorite.getNotes())
                .createdAt(favorite.getCreatedAt())
                .build();
    }
}
