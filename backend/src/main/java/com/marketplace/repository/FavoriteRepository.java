package com.marketplace.repository;

import com.marketplace.entity.Favorite;
import com.marketplace.entity.Product;
import com.marketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Favorite entity
 * Handles user wishlist/favorites operations
 */
@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    /**
     * Find all favorites by user
     */
    List<Favorite> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Find favorite by user and product
     */
    Optional<Favorite> findByUserAndProduct(User user, Product product);

    /**
     * Check if user has favorited a product
     */
    boolean existsByUserAndProduct(User user, Product product);

    /**
     * Count favorites for a product
     */
    Long countByProduct(Product product);

    /**
     * Count user's total favorites
     */
    Long countByUser(User user);

    /**
     * Delete favorite by user and product
     */
    void deleteByUserAndProduct(User user, Product product);

    /**
     * Find most favorited products
     */
    @Query("SELECT f.product, COUNT(f) as favoriteCount FROM Favorite f " +
           "GROUP BY f.product ORDER BY favoriteCount DESC")
    List<Object[]> findMostFavoritedProducts();

    /**
     * Find products favorited by user with specific category
     */
    @Query("SELECT f FROM Favorite f WHERE f.user = :user " +
           "AND f.product.category.id = :categoryId ORDER BY f.createdAt DESC")
    List<Favorite> findByUserAndCategory(@Param("user") User user, @Param("categoryId") Long categoryId);

    /**
     * Get favorite count by category
     */
    @Query("SELECT f.product.category.name, COUNT(f) FROM Favorite f " +
           "GROUP BY f.product.category.name ORDER BY COUNT(f) DESC")
    List<Object[]> getFavoriteCountByCategory();
}
