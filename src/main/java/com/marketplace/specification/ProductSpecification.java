package com.marketplace.specification;

import com.marketplace.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Specification for dynamic Product filtering
 * Enables complex search queries with multiple criteria
 */
public class ProductSpecification {

    /**
     * Build dynamic specification based on search criteria
     */
    public static Specification<Product> filterProducts(
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String location,
            Double minRating,
            LocalDateTime postedAfter,
            Product.ProductStatus status,
            String searchTerm) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by category
            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            // Filter by price range
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            // Filter by location (case-insensitive partial match)
            if (location != null && !location.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("location")),
                    "%" + location.toLowerCase() + "%"
                ));
            }

            // Filter by seller rating (requires join with UserProfile)
            if (minRating != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("owner").get("userProfile").get("averageRating"),
                    minRating
                ));
            }

            // Filter by posted date
            if (postedAfter != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("createdAt"),
                    postedAfter
                ));
            }

            // Filter by status
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            } else {
                // Default: only show available products
                predicates.add(criteriaBuilder.equal(root.get("status"), Product.ProductStatus.AVAILABLE));
            }

            // Search term (searches in title and description)
            if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                String searchPattern = "%" + searchTerm.toLowerCase() + "%";
                Predicate titleMatch = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")),
                    searchPattern
                );
                Predicate descriptionMatch = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("description")),
                    searchPattern
                );
                predicates.add(criteriaBuilder.or(titleMatch, descriptionMatch));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Filter products by category
     */
    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, criteriaBuilder) ->
            categoryId == null ? null : criteriaBuilder.equal(root.get("category").get("id"), categoryId);
    }

    /**
     * Filter products by price range
     */
    public static Specification<Product> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
            }
            if (maxPrice == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            }
            return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
        };
    }

    /**
     * Filter products by location
     */
    public static Specification<Product> hasLocation(String location) {
        return (root, query, criteriaBuilder) ->
            location == null || location.trim().isEmpty() ? null :
            criteriaBuilder.like(
                criteriaBuilder.lower(root.get("location")),
                "%" + location.toLowerCase() + "%"
            );
    }

    /**
     * Filter products by seller rating
     */
    public static Specification<Product> hasSellerRatingGreaterThan(Double minRating) {
        return (root, query, criteriaBuilder) ->
            minRating == null ? null :
            criteriaBuilder.greaterThanOrEqualTo(
                root.get("owner").get("userProfile").get("averageRating"),
                minRating
            );
    }

    /**
     * Filter products posted after date
     */
    public static Specification<Product> postedAfter(LocalDateTime date) {
        return (root, query, criteriaBuilder) ->
            date == null ? null :
            criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), date);
    }

    /**
     * Filter products by status
     */
    public static Specification<Product> hasStatus(Product.ProductStatus status) {
        return (root, query, criteriaBuilder) ->
            status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }

    /**
     * Search products by keyword (title or description)
     */
    public static Specification<Product> searchByKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.trim().isEmpty()) return null;
            
            String searchPattern = "%" + keyword.toLowerCase() + "%";
            Predicate titleMatch = criteriaBuilder.like(
                criteriaBuilder.lower(root.get("title")),
                searchPattern
            );
            Predicate descriptionMatch = criteriaBuilder.like(
                criteriaBuilder.lower(root.get("description")),
                searchPattern
            );
            return criteriaBuilder.or(titleMatch, descriptionMatch);
        };
    }

    /**
     * Filter products by owner
     */
    public static Specification<Product> hasOwner(Long ownerId) {
        return (root, query, criteriaBuilder) ->
            ownerId == null ? null : criteriaBuilder.equal(root.get("owner").get("id"), ownerId);
    }
}
