package com.marketplace.controller;

import com.marketplace.dto.ProductResponse;
import com.marketplace.dto.ProductSearchRequest;
import com.marketplace.entity.Product;
import com.marketplace.repository.ProductRepository;
import com.marketplace.service.ProductService;
import com.marketplace.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * REST Controller for advanced product search
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductSearchController {

    private final ProductRepository productRepository;
    private final ProductService productService;

    /**
     * Advanced product search with filters
     * GET /api/v1/products/search
     * 
     * Query parameters:
     * - categoryId: Filter by category
     * - minPrice: Minimum price
     * - maxPrice: Maximum price
     * - location: Filter by location
     * - minRating: Minimum seller rating
     * - postedAfter: Filter by date (ISO format)
     * - status: Product status
     * - searchTerm: Search in title/description
     * - page: Page number (default 0)
     * - size: Page size (default 20)
     * - sortBy: Sort field (default createdAt)
     * - sortDirection: ASC or DESC (default DESC)
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String postedAfter,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        // Parse date if provided
        LocalDateTime postedAfterDate = null;
        if (postedAfter != null && !postedAfter.isEmpty()) {
            try {
                postedAfterDate = LocalDateTime.parse(postedAfter);
            } catch (Exception e) {
                // Invalid date format, ignore
            }
        }

        // Parse status if provided
        Product.ProductStatus productStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                productStatus = Product.ProductStatus.valueOf(status.toUpperCase());
            } catch (Exception e) {
                // Invalid status, default to AVAILABLE
                productStatus = Product.ProductStatus.AVAILABLE;
            }
        }

        // Build specification
        Specification<Product> spec = ProductSpecification.filterProducts(
                categoryId,
                minPrice,
                maxPrice,
                location,
                minRating,
                postedAfterDate,
                productStatus,
                searchTerm
        );

        // Create pageable with sorting
        Sort sort = sortDirection.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        PageRequest pageable = PageRequest.of(page, size, sort);

        // Execute search
        Page<Product> products = productRepository.findAll(spec, pageable);

        // Map to response DTOs
        Page<ProductResponse> response = products.map(productService::mapToResponse);

        return ResponseEntity.ok(response);
    }

    /**
     * Quick search by keyword
     * GET /api/v1/products/quick-search?q=laptop
     */
    @GetMapping("/quick-search")
    public ResponseEntity<Page<ProductResponse>> quickSearch(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> products = productRepository.searchProducts(
                q, 
                Product.ProductStatus.AVAILABLE, 
                pageable
        );

        Page<ProductResponse> response = products.map(productService::mapToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * Get featured products (high-rated sellers)
     * GET /api/v1/products/featured
     */
    @GetMapping("/featured")
    public ResponseEntity<java.util.List<ProductResponse>> getFeaturedProducts(
            @RequestParam(defaultValue = "4.0") Double minRating,
            @RequestParam(defaultValue = "10") int limit) {

        java.util.List<Product> products = productRepository.findFeaturedProducts(minRating)
                .stream()
                .limit(limit)
                .toList();

        java.util.List<ProductResponse> response = products.stream()
                .map(productService::mapToResponse)
                .toList();

        return ResponseEntity.ok(response);
    }
}
