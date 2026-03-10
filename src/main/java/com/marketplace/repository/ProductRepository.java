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
}
