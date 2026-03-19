package com.marketplace.repository;

import com.marketplace.entity.Product;
import com.marketplace.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository for Product entity
 * Extended with JpaSpecificationExecutor for dynamic queries
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    // Existing methods
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByOwnerId(Long ownerId);
    List<Product> findByOwner(User owner);
    List<Product> findByStatus(Product.ProductStatus status);
    
    Page<Product> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Product> findByCategory_Name(String categoryName, Pageable pageable);
    
    // New advanced query methods
    
    /**
     * Find products by category with pagination
     */
    Page<Product> findByCategoryIdAndStatus(Long categoryId, Product.ProductStatus status, Pageable pageable);
    
    /**
     * Search products by title or description
     */
    @Query("SELECT p FROM Product p WHERE " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND p.status = :status")
    Page<Product> searchProducts(@Param("keyword") String keyword, 
                                 @Param("status") Product.ProductStatus status,
                                 Pageable pageable);
    
    /**
     * Find products by price range
     */
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice " +
           "AND p.status = :status ORDER BY p.createdAt DESC")
    List<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                   @Param("maxPrice") BigDecimal maxPrice,
                                   @Param("status") Product.ProductStatus status);
    
    /**
     * Find products by location
     */
    List<Product> findByLocationContainingIgnoreCaseAndStatus(String location, Product.ProductStatus status);
    
    /**
     * Find featured products (high-rated sellers)
     */
    @Query("SELECT p FROM Product p JOIN p.owner o JOIN o.userProfile up " +
           "WHERE p.status = 'AVAILABLE' AND up.averageRating >= :minRating " +
           "ORDER BY up.averageRating DESC, p.createdAt DESC")
    List<Product> findFeaturedProducts(@Param("minRating") Double minRating);
    
    /**
     * Count products by category
     */
    Long countByCategoryIdAndStatus(Long categoryId, Product.ProductStatus status);
    
    /**
     * Count products by owner
     */
    Long countByOwnerAndStatus(User owner, Product.ProductStatus status);
    
    /**
     * Find recent products
     */
    @Query("SELECT p FROM Product p WHERE p.status = :status " +
           "ORDER BY p.createdAt DESC")
    Page<Product> findRecentProducts(@Param("status") Product.ProductStatus status, Pageable pageable);
    
    /**
     * Find products by multiple categories
     */
    @Query("SELECT p FROM Product p WHERE p.category.id IN :categoryIds " +
           "AND p.status = :status ORDER BY p.createdAt DESC")
    List<Product> findByCategoryIds(@Param("categoryIds") List<Long> categoryIds,
                                    @Param("status") Product.ProductStatus status);
    
    // ============================================
    // AI-SPECIFIC QUERIES FOR MARKETPLACE INTELLIGENCE
    // ============================================
    
    /**
     * Find similar products by category and price range (for AI comparison)
     */
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId " +
           "AND p.id != :excludeId " +
           "AND p.price BETWEEN :minPrice AND :maxPrice " +
           "AND p.status = 'AVAILABLE' " +
           "ORDER BY ABS(p.price - :targetPrice) ASC")
    List<Product> findSimilarProducts(@Param("categoryId") Long categoryId,
                                      @Param("excludeId") Long excludeId,
                                      @Param("minPrice") BigDecimal minPrice,
                                      @Param("maxPrice") BigDecimal maxPrice,
                                      @Param("targetPrice") BigDecimal targetPrice,
                                      Pageable pageable);
    
    /**
     * Calculate average price by category (for AI price estimation)
     */
    @Query("SELECT AVG(p.price) FROM Product p WHERE p.category.id = :categoryId " +
           "AND p.status = 'AVAILABLE'")
    BigDecimal findAveragePriceByCategory(@Param("categoryId") Long categoryId);
    
    /**
     * Find price statistics by category (min, max, avg)
     */
    @Query("SELECT MIN(p.price), MAX(p.price), AVG(p.price), COUNT(p) " +
           "FROM Product p WHERE p.category.id = :categoryId " +
           "AND p.status = 'AVAILABLE'")
    Object[] findPriceStatsByCategory(@Param("categoryId") Long categoryId);
    
    /**
     * Find top selling products by category (most transactions)
     */
    @Query("SELECT p, COUNT(t) as transactionCount FROM Product p " +
           "LEFT JOIN Transaction t ON t.product.id = p.id " +
           "WHERE p.category.id = :categoryId " +
           "GROUP BY p.id " +
           "ORDER BY transactionCount DESC")
    List<Object[]> findTopSellingProductsByCategory(@Param("categoryId") Long categoryId, Pageable pageable);
    
    /**
     * Find products with best ratings in category
     */
    @Query("SELECT p, AVG(r.rating) as avgRating, COUNT(r) as reviewCount " +
           "FROM Product p " +
           "LEFT JOIN Review r ON r.product.id = p.id " +
           "WHERE p.category.id = :categoryId AND p.status = 'AVAILABLE' " +
           "GROUP BY p.id " +
           "HAVING COUNT(r) >= :minReviews " +
           "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedProductsByCategory(@Param("categoryId") Long categoryId,
                                                   @Param("minReviews") Long minReviews,
                                                   Pageable pageable);
    
    /**
     * Find recently sold products in category (for market trend analysis)
     */
    @Query("SELECT p FROM Product p " +
           "JOIN Transaction t ON t.product.id = p.id " +
           "WHERE p.category.id = :categoryId " +
           "AND t.createdAt >= :since " +
           "ORDER BY t.createdAt DESC")
    List<Product> findRecentlySoldProducts(@Param("categoryId") Long categoryId,
                                           @Param("since") java.time.LocalDateTime since,
                                           Pageable pageable);
    
    /**
     * Count available products by seller (for seller performance)
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.owner.id = :sellerId " +
           "AND p.status = 'AVAILABLE'")
    Long countActiveProductsBySeller(@Param("sellerId") Long sellerId);
    
    /**
     * Find seller's average product price
     */
    @Query("SELECT AVG(p.price) FROM Product p WHERE p.owner.id = :sellerId " +
           "AND p.status = 'AVAILABLE'")
    BigDecimal findAverageProductPriceBySeller(@Param("sellerId") Long sellerId);
}

