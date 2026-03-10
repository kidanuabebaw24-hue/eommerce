# Repository Layer Guide

## Overview
This document explains all repository interfaces and their custom query methods for the MarketBridge platform.

---

## 📦 Repository Structure

```
src/main/java/com/marketplace/
├── repository/
│   ├── UserRepository.java (existing)
│   ├── ProductRepository.java (enhanced) ✨
│   ├── CategoryRepository.java (existing)
│   ├── MessageRepository.java (existing)
│   ├── UserProfileRepository.java ✨ NEW
│   ├── TransactionRepository.java ✨ NEW
│   ├── PaymentRepository.java ✨ NEW
│   ├── FavoriteRepository.java ✨ NEW
│   └── ReviewRepository.java ✨ NEW
└── specification/
    └── ProductSpecification.java ✨ NEW
```

---

## 1️⃣ ReviewRepository

### Purpose
Manages product and seller reviews with rating calculations.

### Key Methods

#### Basic Queries
```java
// Find approved reviews for a product
List<Review> findByProductAndStatusOrderByCreatedAtDesc(Product product, ReviewStatus status);

// Check if user already reviewed a product
boolean existsByReviewerAndProduct(User reviewer, Product product);
```

#### Analytics Queries
```java
// Calculate average rating for seller
Double calculateAverageRatingForSeller(User seller);

// Get rating distribution (5 stars: 10, 4 stars: 5, etc.)
List<Object[]> getRatingDistributionForProduct(Product product);

// Find top-rated products
List<Object[]> findTopRatedProducts(Long minReviews);
```

### Usage Example
```java
@Autowired
private ReviewRepository reviewRepository;

// Get seller's average rating
Double avgRating = reviewRepository.calculateAverageRatingForSeller(seller);

// Check if buyer can review
boolean canReview = !reviewRepository.existsByReviewerAndProduct(buyer, product);
```

---

## 2️⃣ TransactionRepository

### Purpose
Tracks all purchase transactions and calculates revenue analytics.

### Key Methods

#### Transaction Queries
```java
// Find buyer's purchase history
List<Transaction> findByBuyerOrderByCreatedAtDesc(User buyer);

// Find seller's sales
List<Transaction> findBySellerOrderByCreatedAtDesc(User seller);

// Check if buyer purchased product (for review eligibility)
boolean hasBuyerPurchasedProduct(User buyer, Long productId);
```

#### Revenue Analytics
```java
// Calculate total platform revenue
BigDecimal calculateTotalRevenue();

// Calculate seller's earnings
BigDecimal calculateSellerEarnings(User seller);

// Get monthly revenue statistics
List<Object[]> getMonthlyRevenue(LocalDateTime startDate);

// Find top sellers by revenue
List<Object[]> findTopSellersByRevenue();
```

### Usage Example
```java
@Autowired
private TransactionRepository transactionRepository;

// Get seller's total earnings
BigDecimal earnings = transactionRepository.calculateSellerEarnings(seller);

// Check purchase eligibility for review
boolean purchased = transactionRepository.hasBuyerPurchasedProduct(buyer, productId);
```

---

## 3️⃣ PaymentRepository

### Purpose
Manages payment gateway data and verification.

### Key Methods

```java
// Find payment by gateway reference (for verification)
Optional<Payment> findByGatewayReference(String gatewayReference);

// Find unverified payments
List<Payment> findByIsVerifiedFalseOrderByCreatedAtDesc();

// Find expired pending payments
List<Payment> findPendingPaymentsOlderThan(LocalDateTime cutoffTime);
```

### Usage Example
```java
@Autowired
private PaymentRepository paymentRepository;

// Verify payment from Chapa callback
Optional<Payment> payment = paymentRepository.findByGatewayReference(chapaRef);
if (payment.isPresent()) {
    payment.get().setIsVerified(true);
    paymentRepository.save(payment.get());
}
```

---

## 4️⃣ FavoriteRepository

### Purpose
Manages user wishlist/favorites.

### Key Methods

```java
// Get user's favorites
List<Favorite> findByUserOrderByCreatedAtDesc(User user);

// Check if product is favorited
boolean existsByUserAndProduct(User user, Product product);

// Remove from favorites
void deleteByUserAndProduct(User user, Product product);

// Find most favorited products
List<Object[]> findMostFavoritedProducts();
```

### Usage Example
```java
@Autowired
private FavoriteRepository favoriteRepository;

// Toggle favorite
if (favoriteRepository.existsByUserAndProduct(user, product)) {
    favoriteRepository.deleteByUserAndProduct(user, product);
} else {
    Favorite favorite = Favorite.builder()
        .user(user)
        .product(product)
        .build();
    favoriteRepository.save(favorite);
}
```

---

## 5️⃣ UserProfileRepository

### Purpose
Manages extended user profile information.

### Key Methods

```java
// Find profile by user
Optional<UserProfile> findByUser(User user);

// Find verified sellers with minimum rating
List<UserProfile> findVerifiedSellersWithMinRating(Double minRating);

// Find top-rated sellers
List<UserProfile> findTopRatedSellers();
```

### Usage Example
```java
@Autowired
private UserProfileRepository profileRepository;

// Get or create profile
UserProfile profile = profileRepository.findByUser(user)
    .orElseGet(() -> {
        UserProfile newProfile = UserProfile.builder()
            .user(user)
            .verificationStatus(VerificationStatus.UNVERIFIED)
            .build();
        return profileRepository.save(newProfile);
    });
```

---

## 6️⃣ ProductRepository (Enhanced)

### Purpose
Product search with advanced filtering using JPA Specifications.

### Key Features

#### 1. Specification Support
```java
// Implements JpaSpecificationExecutor<Product>
// Enables dynamic query building
```

#### 2. Advanced Search
```java
// Search by keyword
Page<Product> searchProducts(String keyword, ProductStatus status, Pageable pageable);

// Find by price range
List<Product> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, ProductStatus status);

// Find featured products (high-rated sellers)
List<Product> findFeaturedProducts(Double minRating);
```

### Usage Example
```java
@Autowired
private ProductRepository productRepository;

// Simple search
Page<Product> results = productRepository.searchProducts(
    "laptop", 
    ProductStatus.AVAILABLE, 
    PageRequest.of(0, 10)
);

// Advanced filtering with Specification
Specification<Product> spec = ProductSpecification.filterProducts(
    categoryId,      // 1L (Electronics)
    minPrice,        // 5000
    maxPrice,        // 20000
    location,        // "Addis Ababa"
    minRating,       // 4.0
    postedAfter,     // Last 7 days
    status,          // AVAILABLE
    searchTerm       // "laptop"
);

List<Product> filtered = productRepository.findAll(spec);
```

---

## 🔍 ProductSpecification Class

### Purpose
Build dynamic queries for complex product filtering.

### Available Filters

| Filter | Method | Description |
|--------|--------|-------------|
| Category | `hasCategory(Long categoryId)` | Filter by category |
| Price Range | `hasPriceBetween(min, max)` | Filter by price |
| Location | `hasLocation(String location)` | Filter by location |
| Seller Rating | `hasSellerRatingGreaterThan(Double rating)` | Filter by seller rating |
| Posted Date | `postedAfter(LocalDateTime date)` | Filter by date |
| Status | `hasStatus(ProductStatus status)` | Filter by status |
| Keyword | `searchByKeyword(String keyword)` | Search in title/description |

### Combining Filters

```java
// Method 1: Use the all-in-one filter
Specification<Product> spec = ProductSpecification.filterProducts(
    categoryId, minPrice, maxPrice, location, 
    minRating, postedAfter, status, searchTerm
);

// Method 2: Combine individual specifications
Specification<Product> spec = Specification
    .where(ProductSpecification.hasCategory(1L))
    .and(ProductSpecification.hasPriceBetween(5000, 20000))
    .and(ProductSpecification.hasLocation("Addis"))
    .and(ProductSpecification.hasSellerRatingGreaterThan(4.0));

List<Product> products = productRepository.findAll(spec);
```

---

## 📊 Query Performance Tips

### 1. Use Pagination
```java
// Good: Paginated results
Page<Product> products = productRepository.findAll(
    spec, 
    PageRequest.of(0, 20)
);

// Bad: Loading all results
List<Product> products = productRepository.findAll(spec);
```

### 2. Fetch Only What You Need
```java
// Use projections for list views
@Query("SELECT new com.marketplace.dto.ProductSummary(p.id, p.title, p.price) " +
       "FROM Product p WHERE p.status = :status")
List<ProductSummary> findProductSummaries(@Param("status") ProductStatus status);
```

### 3. Index Important Columns
Already indexed in entities:
- `status` (Product)
- `created_at` (all entities)
- `rating` (Review)
- Foreign keys (automatic)

---

## 🧪 Testing Repositories

### Example Test
```java
@SpringBootTest
@Transactional
class ReviewRepositoryTest {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Test
    void testCalculateAverageRating() {
        // Given
        User seller = createTestSeller();
        createReview(seller, 5);
        createReview(seller, 4);
        
        // When
        Double avgRating = reviewRepository.calculateAverageRatingForSeller(seller);
        
        // Then
        assertEquals(4.5, avgRating, 0.01);
    }
}
```

---

## 🚀 Next Steps

After repositories are ready:
1. ✅ Create DTOs for API requests/responses
2. ✅ Implement Service layer with business logic
3. ✅ Create REST Controllers
4. ✅ Add security configurations
5. ✅ Build frontend components

---

## 📝 Common Patterns

### Pattern 1: Check Existence Before Action
```java
if (!favoriteRepository.existsByUserAndProduct(user, product)) {
    // Add to favorites
}
```

### Pattern 2: Calculate and Update Ratings
```java
Double avgRating = reviewRepository.calculateAverageRatingForSeller(seller);
Long reviewCount = reviewRepository.countBySellerAndStatus(seller, APPROVED);

UserProfile profile = seller.getUserProfile();
profile.setAverageRating(avgRating);
profile.setReviewCount(reviewCount.intValue());
profileRepository.save(profile);
```

### Pattern 3: Transaction Verification
```java
boolean canReview = transactionRepository.hasBuyerPurchasedProduct(buyer, productId)
    && !reviewRepository.existsByReviewerAndProduct(buyer, product);
```

---

## 📚 Additional Resources

- [Spring Data JPA Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [JPA Specifications Guide](https://spring.io/blog/2011/04/26/advanced-spring-data-jpa-specifications-and-querydsl/)
- [Query Methods Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods)
