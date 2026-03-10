package com.marketplace.repository;

import com.marketplace.entity.User;
import com.marketplace.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for UserProfile entity
 * Handles user profile data access operations
 */
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    /**
     * Find profile by user
     */
    Optional<UserProfile> findByUser(User user);

    /**
     * Find profile by user ID
     */
    Optional<UserProfile> findByUserId(Long userId);

    /**
     * Find profiles by verification status
     */
    List<UserProfile> findByVerificationStatus(UserProfile.VerificationStatus status);

    /**
     * Find profiles by location (case-insensitive)
     */
    List<UserProfile> findByLocationContainingIgnoreCase(String location);

    /**
     * Find profiles by city
     */
    List<UserProfile> findByCity(String city);

    /**
     * Find verified sellers with minimum rating
     */
    @Query("SELECT up FROM UserProfile up WHERE up.verificationStatus = 'VERIFIED' " +
           "AND up.averageRating >= :minRating ORDER BY up.averageRating DESC")
    List<UserProfile> findVerifiedSellersWithMinRating(@Param("minRating") Double minRating);

    /**
     * Find top-rated sellers
     */
    @Query("SELECT up FROM UserProfile up WHERE up.reviewCount > 0 " +
           "ORDER BY up.averageRating DESC, up.reviewCount DESC")
    List<UserProfile> findTopRatedSellers();

    /**
     * Count profiles by verification status
     */
    Long countByVerificationStatus(UserProfile.VerificationStatus status);

    /**
     * Check if user has profile
     */
    boolean existsByUserId(Long userId);
}
