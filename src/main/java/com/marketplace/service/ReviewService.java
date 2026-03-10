package com.marketplace.service;

import com.marketplace.dto.RatingDistributionResponse;
import com.marketplace.dto.ReviewRequest;
import com.marketplace.dto.ReviewResponse;
import com.marketplace.entity.Product;
import com.marketplace.entity.Review;
import com.marketplace.entity.User;
import com.marketplace.entity.UserProfile;
import com.marketplace.repository.ProductRepository;
import com.marketplace.repository.ReviewRepository;
import com.marketplace.repository.TransactionRepository;
import com.marketplace.repository.UserProfileRepository;
import com.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for review management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final UserProfileRepository profileRepository;

    /**
     * Create a new review
     */
    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User reviewer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Validate: User must have purchased the product
        boolean hasPurchased = transactionRepository.hasBuyerPurchasedProduct(reviewer, request.getProductId());
        if (!hasPurchased) {
            throw new RuntimeException("You can only review products you have purchased");
        }

        // Validate: One review per product per user
        if (reviewRepository.existsByReviewerAndProduct(reviewer, product)) {
            throw new RuntimeException("You have already reviewed this product");
        }

        // Create review
        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .reviewer(reviewer)
                .seller(product.getOwner())
                .product(product)
                .status(Review.ReviewStatus.APPROVED) // Auto-approve for now
                .build();

        Review savedReview = reviewRepository.save(review);
        log.info("Review created by {} for product {}", username, product.getId());

        // Update seller's rating
        updateSellerRating(product.getOwner());

        return mapToResponse(savedReview);
    }

    /**
     * Get reviews for a product
     */
    public List<ReviewResponse> getProductReviews(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return reviewRepository.findByProductAndStatusOrderByCreatedAtDesc(product, Review.ReviewStatus.APPROVED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get reviews for a seller
     */
    public List<ReviewResponse> getSellerReviews(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        return reviewRepository.findBySellerAndStatusOrderByCreatedAtDesc(seller, Review.ReviewStatus.APPROVED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get my reviews (as reviewer)
     */
    public List<ReviewResponse> getMyReviews() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User reviewer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reviewRepository.findByReviewerOrderByCreatedAtDesc(reviewer)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get rating distribution for product
     */
    public RatingDistributionResponse getProductRatingDistribution(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Double avgRating = reviewRepository.calculateAverageRatingForProduct(product);
        Long totalReviews = reviewRepository.countByProductAndStatus(product, Review.ReviewStatus.APPROVED);
        List<Object[]> distribution = reviewRepository.getRatingDistributionForProduct(product);

        return buildRatingDistribution(avgRating, totalReviews, distribution);
    }

    /**
     * Get rating distribution for seller
     */
    public RatingDistributionResponse getSellerRatingDistribution(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Double avgRating = reviewRepository.calculateAverageRatingForSeller(seller);
        Long totalReviews = reviewRepository.countBySellerAndStatus(seller, Review.ReviewStatus.APPROVED);
        List<Object[]> distribution = reviewRepository.getRatingDistributionForSeller(seller);

        return buildRatingDistribution(avgRating, totalReviews, distribution);
    }

    /**
     * Update seller's average rating
     */
    @Transactional
    public void updateSellerRating(User seller) {
        Double avgRating = reviewRepository.calculateAverageRatingForSeller(seller);
        Long reviewCount = reviewRepository.countBySellerAndStatus(seller, Review.ReviewStatus.APPROVED);

        UserProfile profile = profileRepository.findByUser(seller)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setAverageRating(avgRating != null ? avgRating : 0.0);
        profile.setReviewCount(reviewCount.intValue());
        profileRepository.save(profile);

        log.info("Updated rating for seller {}: {} ({} reviews)", seller.getUsername(), avgRating, reviewCount);
    }

    /**
     * Build rating distribution response
     */
    private RatingDistributionResponse buildRatingDistribution(Double avgRating, Long totalReviews, List<Object[]> distribution) {
        Map<Integer, Long> distributionMap = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            distributionMap.put(i, 0L);
        }

        for (Object[] row : distribution) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            distributionMap.put(rating, count);
        }

        double total = totalReviews > 0 ? totalReviews : 1;

        return RatingDistributionResponse.builder()
                .averageRating(avgRating != null ? avgRating : 0.0)
                .totalReviews(totalReviews)
                .distribution(distributionMap)
                .fiveStarPercentage((distributionMap.get(5) / total) * 100)
                .fourStarPercentage((distributionMap.get(4) / total) * 100)
                .threeStarPercentage((distributionMap.get(3) / total) * 100)
                .twoStarPercentage((distributionMap.get(2) / total) * 100)
                .oneStarPercentage((distributionMap.get(1) / total) * 100)
                .build();
    }

    /**
     * Map entity to response DTO
     */
    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewerId(review.getReviewer().getId())
                .reviewerUsername(review.getReviewer().getUsername())
                .reviewerProfilePhoto(review.getReviewer().getUserProfile() != null ? 
                    review.getReviewer().getUserProfile().getProfilePhoto() : null)
                .sellerId(review.getSeller().getId())
                .sellerUsername(review.getSeller().getUsername())
                .productId(review.getProduct().getId())
                .productTitle(review.getProduct().getTitle())
                .transactionId(review.getTransaction() != null ? review.getTransaction().getId() : null)
                .status(review.getStatus().name())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
