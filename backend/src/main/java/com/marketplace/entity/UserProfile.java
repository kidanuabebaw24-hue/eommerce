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
 * UserProfile Entity - Extended user information
 * Stores additional profile data beyond authentication
 */
@Entity
@Table(name = "user_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One-to-one relationship with User
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Profile photo URL
    @Column(name = "profile_photo")
    private String profilePhoto;

    // User biography
    @Column(columnDefinition = "TEXT")
    private String bio;

    // Phone number
    @Column(length = 20)
    private String phone;

    // Location/Address
    @Column(length = 255)
    private String location;

    // City
    @Column(length = 100)
    private String city;

    // Country
    @Column(length = 100)
    private String country;

    // Verification status
    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 20)
    private VerificationStatus verificationStatus;

    // Verification document URL (ID, passport, etc.)
    @Column(name = "verification_document")
    private String verificationDocument;

    // Date when verification was completed
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    // Social media links
    @Column(name = "facebook_url")
    private String facebookUrl;

    @Column(name = "twitter_url")
    private String twitterUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    // Business information (for sellers)
    @Column(name = "business_name")
    private String businessName;

    @Column(name = "business_registration")
    private String businessRegistration;

    // Average rating (calculated from reviews)
    @Column(name = "average_rating")
    private Double averageRating;

    // Total number of reviews received
    @Builder.Default
    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Verification status enum
    public enum VerificationStatus {
        UNVERIFIED,     // Not verified
        PENDING,        // Verification in progress
        VERIFIED,       // Successfully verified
        REJECTED        // Verification rejected
    }
}
