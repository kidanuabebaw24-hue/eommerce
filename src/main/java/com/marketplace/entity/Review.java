package com.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Review Entity - Product and seller reviews
 * Allows buyers to rate and review after purchase
 */
@Entity
@Table(name = "reviews", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"reviewer_id", "product_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Rating from 1 to 5
    @Column(nullable = false)
    private Integer rating;

    // Review comment
    @Column(columnDefinition = "TEXT")
    private String comment;

    // User who wrote the review (buyer)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    // Seller being reviewed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    // Product being reviewed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Transaction reference (ensures buyer purchased the product)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    // Review status (for moderation)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReviewStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Review status enum
    public enum ReviewStatus {
        PENDING,    // Awaiting moderation
        APPROVED,   // Approved and visible
        REJECTED,   // Rejected by admin
        FLAGGED     // Flagged for review
    }

    // Validation: Rating must be between 1 and 5
    @PrePersist
    @PreUpdate
    private void validateRating() {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
    }
}
