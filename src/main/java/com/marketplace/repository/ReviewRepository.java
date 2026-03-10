package com.marketplace.repository;

import com.marketplace.entity.Product;
import com.marketplace.entity.Review;
import com.marketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Review entity
 * Handles product and seller reviews
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Find reviews by product
     */
    List<Review> findByProductAndStatusOrderByCreatedAtDesc(Product product, Review.ReviewStatus status);

    /**
     * Find all reviews for a product (including pending)
     */
    List<Review> findByProductOrderByCreatedAtDesc(Product product);

    /**
     * Find reviews by seller
     */
    List<Review> findBySellerAndStatusOrderByCreatedAtDesc(User seller, Review.ReviewStatus status);

    /**
     * Find reviews by reviewer
     */
    List<Review> findByReviewerOrderByCreatedAtDesc(User reviewer);

    /**
     * Find review by reviewer and product
     */
    Optional<Review> findByReviewerAndProduct(User reviewer, Product product);

    /**
     * Check if reviewer has reviewed product
     */
    boolean existsByReviewerAndProduct(User reviewer, Product product);

    /**
     * Find reviews by status
     */
    List<Review> findByStatusOrderByCreatedAtDesc(Review.ReviewStatus status);

    /**
     * Calculate average rating for product
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product = :product AND r.status = 'APPROVED'")
    Double calculateAverageRatingForProduct(@Param("product") Product product);

    /**
     * Calculate average rating for seller
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.seller = :seller AND r.status = 'APPROVED'")
    Double calculateAverageRatingForSeller(@Param("seller") User seller);

    /**
     * Count reviews for product
     */
    Long countByProductAndStatus(Product product, Review.ReviewStatus status);

    /**
     * Count reviews for seller
     */
    Long countBySellerAndStatus(User seller, Review.ReviewStatus status);

    /**
     * Find reviews by rating range
     */
    @Query("SELECT r FROM Review r WHERE r.rating BETWEEN :minRating AND :maxRating " +
           "AND r.status = 'APPROVED' ORDER BY r.createdAt DESC")
    List<Review> findByRatingRange(@Param("minRating") Integer minRating, 
                                   @Param("maxRating") Integer maxRating);

    /**
     * Find top-rated products
     */
    @Query("SELECT r.product, AVG(r.rating) as avgRating, COUNT(r) as reviewCount " +
           "FROM Review r WHERE r.status = 'APPROVED' " +
           "GROUP BY r.product HAVING COUNT(r) >= :minReviews " +
           "ORDER BY avgRating DESC, reviewCount DESC")
    List<Object[]> findTopRatedProducts(@Param("minReviews") Long minReviews);

    /**
     * Get rating distribution for product
     */
    @Query("SELECT r.rating, COUNT(r) FROM Review r " +
           "WHERE r.product = :product AND r.status = 'APPROVED' " +
           "GROUP BY r.rating ORDER BY r.rating DESC")
    List<Object[]> getRatingDistributionForProduct(@Param("product") Product product);

    /**
     * Get rating distribution for seller
     */
    @Query("SELECT r.rating, COUNT(r) FROM Review r " +
           "WHERE r.seller = :seller AND r.status = 'APPROVED' " +
           "GROUP BY r.rating ORDER BY r.rating DESC")
    List<Object[]> getRatingDistributionForSeller(@Param("seller") User seller);

    /**
     * Find recent reviews (last N days)
     */
    @Query("SELECT r FROM Review r WHERE r.createdAt >= :sinceDate " +
           "AND r.status = 'APPROVED' ORDER BY r.createdAt DESC")
    List<Review> findRecentReviews(@Param("sinceDate") java.time.LocalDateTime sinceDate);

    /**
     * Count pending reviews (for moderation)
     */
    Long countByStatus(Review.ReviewStatus status);
}
