# DTO (Data Transfer Objects) Guide

## Overview
This document explains all DTOs used for API requests and responses in the MarketBridge platform.

---

## 📦 DTO Structure

```
src/main/java/com/marketplace/dto/
├── Request DTOs (Input)
│   ├── TransactionRequest.java
│   ├── PaymentInitiateRequest.java
│   ├── PaymentVerifyRequest.java
│   ├── ReviewRequest.java
│   ├── UserProfileRequest.java
│   └── ProductSearchRequest.java
│
└── Response DTOs (Output)
    ├── TransactionResponse.java
    ├── PaymentResponse.java
    ├── PaymentInitiateResponse.java
    ├── ReviewResponse.java
    ├── UserProfileResponse.java
    ├── FavoriteResponse.java
    ├── AnalyticsOverviewResponse.java
    ├── RevenueAnalyticsResponse.java
    ├── CategoryAnalyticsResponse.java
    ├── SellerAnalyticsResponse.java
    └── RatingDistributionResponse.java
```

---

## 📥 REQUEST DTOs

### 1. TransactionRequest
**Purpose:** Initiate a product purchase

```java
{
  "productId": 123,
  "amount": 15000.00,
  "paymentMethod": "chapa",
  "notes": "Please deliver to office"
}
```

**Validation:**
- `productId`: Required, must exist
- `amount`: Required, must be positive
- `paymentMethod`: Optional
- `notes`: Optional

**Usage:**
```java
POST /api/v1/payments/initiate
Content-Type: application/json

{
  "productId": 123,
  "amount": 15000.00
}
```

---

### 2. PaymentInitiateRequest
**Purpose:** Start payment process with gateway

```java
{
  "transactionId": 456,
  "amount": 15000.00,
  "currency": "ETB",
  "email": "buyer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+251911234567",
  "returnUrl": "https://marketbridge.com/payment/callback"
}
```

**Validation:**
- All fields required except `phoneNumber`
- `email`: Must be valid email format
- `amount`: Must be positive
- `currency`: ISO currency code (ETB, USD, etc.)

---

### 3. PaymentVerifyRequest
**Purpose:** Verify payment after gateway callback

```java
{
  "paymentReference": "TXN-123456",
  "gatewayReference": "CHAPA-789012"
}
```

**Validation:**
- Both fields required
- References must match existing records

---

### 4. ReviewRequest
**Purpose:** Submit product/seller review

```java
{
  "rating": 5,
  "comment": "Excellent product and fast delivery!",
  "productId": 123,
  "transactionId": 456
}
```

**Validation:**
- `rating`: Required, 1-5 only
- `comment`: Required, 10-1000 characters
- `productId`: Required
- `transactionId`: Optional (for verification)

**Business Rules:**
- User must have purchased the product
- One review per product per user
- Review requires completed transaction

---

### 5. UserProfileRequest
**Purpose:** Update user profile information

```java
{
  "bio": "Experienced seller of electronics",
  "phone": "+251911234567",
  "location": "Bole, Addis Ababa",
  "city": "Addis Ababa",
  "country": "Ethiopia",
  "facebookUrl": "https://facebook.com/username",
  "businessName": "Tech Solutions Ltd",
  "businessRegistration": "REG-12345"
}
```

**Validation:**
- All fields optional
- `phone`: Must match pattern `^[+]?[0-9]{10,15}$`
- `bio`: Max 500 characters
- URLs: Max 255 characters

---

### 6. ProductSearchRequest
**Purpose:** Advanced product search with filters

```java
{
  "categoryId": 1,
  "minPrice": 5000,
  "maxPrice": 20000,
  "location": "Addis Ababa",
  "minRating": 4.0,
  "postedAfter": "2024-01-01T00:00:00",
  "status": "AVAILABLE",
  "searchTerm": "laptop",
  "page": 0,
  "size": 20,
  "sortBy": "createdAt",
  "sortDirection": "DESC"
}
```

**All fields optional** - Builds dynamic query based on provided filters

---

## 📤 RESPONSE DTOs

### 1. TransactionResponse
**Purpose:** Transaction details

```json
{
  "id": 456,
  "buyerId": 10,
  "buyerUsername": "john_doe",
  "sellerId": 20,
  "sellerUsername": "tech_seller",
  "productId": 123,
  "productTitle": "MacBook Pro 2023",
  "amount": 15000.00,
  "status": "SUCCESS",
  "paymentReference": "TXN-123456",
  "paymentMethod": "chapa",
  "notes": "Delivered successfully",
  "createdAt": "2024-03-09T10:30:00",
  "updatedAt": "2024-03-09T11:00:00"
}
```

---

### 2. PaymentInitiateResponse
**Purpose:** Payment gateway checkout URL

```json
{
  "checkoutUrl": "https://checkout.chapa.co/pay/abc123",
  "paymentReference": "TXN-123456",
  "status": "INITIATED",
  "message": "Payment initiated successfully"
}
```

**Frontend Usage:**
```javascript
// Redirect user to checkout URL
window.location.href = response.checkoutUrl;
```

---

### 3. ReviewResponse
**Purpose:** Review details with reviewer info

```json
{
  "id": 789,
  "rating": 5,
  "comment": "Excellent product!",
  "reviewerId": 10,
  "reviewerUsername": "john_doe",
  "reviewerProfilePhoto": "/uploads/profile.jpg",
  "sellerId": 20,
  "sellerUsername": "tech_seller",
  "productId": 123,
  "productTitle": "MacBook Pro 2023",
  "transactionId": 456,
  "status": "APPROVED",
  "createdAt": "2024-03-09T12:00:00",
  "updatedAt": "2024-03-09T12:00:00"
}
```

---

### 4. UserProfileResponse
**Purpose:** Complete user profile data

```json
{
  "id": 1,
  "userId": 10,
  "username": "john_doe",
  "fullname": "John Doe",
  "email": "john@example.com",
  "profilePhoto": "/uploads/profile.jpg",
  "bio": "Experienced seller",
  "phone": "+251911234567",
  "location": "Bole, Addis Ababa",
  "city": "Addis Ababa",
  "country": "Ethiopia",
  "verificationStatus": "VERIFIED",
  "verifiedAt": "2024-01-15T10:00:00",
  "businessName": "Tech Solutions Ltd",
  "averageRating": 4.8,
  "reviewCount": 150,
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-03-09T10:00:00"
}
```

---

### 5. FavoriteResponse
**Purpose:** Favorite/wishlist item with product details

```json
{
  "id": 100,
  "userId": 10,
  "productId": 123,
  "productTitle": "MacBook Pro 2023",
  "productDescription": "Latest model with M3 chip",
  "productPrice": 15000.00,
  "productStatus": "AVAILABLE",
  "productImages": ["/uploads/img1.jpg", "/uploads/img2.jpg"],
  "categoryName": "Electronics",
  "sellerUsername": "tech_seller",
  "notes": "Save for later",
  "createdAt": "2024-03-09T10:00:00"
}
```

---

### 6. AnalyticsOverviewResponse
**Purpose:** Admin dashboard overview

```json
{
  "totalUsers": 5000,
  "totalProducts": 12000,
  "totalTransactions": 8500,
  "successfulTransactions": 8000,
  "pendingTransactions": 500,
  "totalRevenue": 25000000.00,
  "monthlyRevenue": 2500000.00,
  "totalReviews": 6000,
  "averagePlatformRating": 4.5,
  "verifiedSellers": 1200,
  "activeBuyers": 3500
}
```

---

### 7. RevenueAnalyticsResponse
**Purpose:** Detailed revenue breakdown

```json
{
  "totalRevenue": 25000000.00,
  "monthlyRevenue": 2500000.00,
  "weeklyRevenue": 600000.00,
  "dailyRevenue": 85000.00,
  "monthlyBreakdown": [
    {
      "month": "2024-03",
      "revenue": 2500000.00,
      "transactionCount": 850
    },
    {
      "month": "2024-02",
      "revenue": 2200000.00,
      "transactionCount": 780
    }
  ],
  "categoryBreakdown": [
    {
      "categoryName": "Electronics",
      "revenue": 10000000.00,
      "transactionCount": 3500
    },
    {
      "categoryName": "Fashion",
      "revenue": 5000000.00,
      "transactionCount": 2000
    }
  ]
}
```

---

### 8. RatingDistributionResponse
**Purpose:** Rating statistics and distribution

```json
{
  "averageRating": 4.5,
  "totalReviews": 1000,
  "distribution": {
    "5": 600,
    "4": 250,
    "3": 100,
    "2": 30,
    "1": 20
  },
  "fiveStarPercentage": 60.0,
  "fourStarPercentage": 25.0,
  "threeStarPercentage": 10.0,
  "twoStarPercentage": 3.0,
  "oneStarPercentage": 2.0
}
```

**Frontend Usage:**
```javascript
// Display star rating chart
const data = response.distribution;
// {5: 600, 4: 250, 3: 100, 2: 30, 1: 20}
```

---

### 9. SellerAnalyticsResponse
**Purpose:** Individual seller performance

```json
{
  "sellerId": 20,
  "sellerUsername": "tech_seller",
  "sellerEmail": "seller@example.com",
  "totalProducts": 50,
  "soldProducts": 35,
  "totalTransactions": 120,
  "totalEarnings": 1500000.00,
  "averageRating": 4.8,
  "reviewCount": 95,
  "verificationStatus": "VERIFIED"
}
```

---

### 10. CategoryAnalyticsResponse
**Purpose:** Category performance metrics

```json
{
  "categoryId": 1,
  "categoryName": "Electronics",
  "productCount": 3500,
  "transactionCount": 2800,
  "totalRevenue": 10000000.00,
  "favoriteCount": 5000,
  "averageRating": 4.6
}
```

---

## 🔄 DTO Mapping Patterns

### Entity to Response DTO
```java
public UserProfileResponse mapToResponse(UserProfile profile) {
    return UserProfileResponse.builder()
        .id(profile.getId())
        .userId(profile.getUser().getId())
        .username(profile.getUser().getUsername())
        .fullname(profile.getUser().getFullname())
        .email(profile.getUser().getEmail())
        .profilePhoto(profile.getProfilePhoto())
        .bio(profile.getBio())
        // ... map all fields
        .build();
}
```

### Request DTO to Entity
```java
public Review createReviewFromRequest(ReviewRequest request, User reviewer, Product product) {
    return Review.builder()
        .rating(request.getRating())
        .comment(request.getComment())
        .reviewer(reviewer)
        .seller(product.getOwner())
        .product(product)
        .status(Review.ReviewStatus.PENDING)
        .build();
}
```

---

## ✅ Validation Annotations

### Common Annotations Used

| Annotation | Purpose | Example |
|------------|---------|---------|
| `@NotNull` | Field cannot be null | `@NotNull private Long productId;` |
| `@NotBlank` | String cannot be null/empty | `@NotBlank private String email;` |
| `@Email` | Valid email format | `@Email private String email;` |
| `@Min` / `@Max` | Number range | `@Min(1) @Max(5) private Integer rating;` |
| `@Size` | String length | `@Size(min=10, max=1000) private String comment;` |
| `@Positive` | Positive number | `@Positive private BigDecimal amount;` |
| `@Pattern` | Regex validation | `@Pattern(regexp="...") private String phone;` |

---

## 🎯 Best Practices

### 1. Never Expose Entities Directly
```java
// ❌ Bad
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userRepository.findById(id).orElseThrow();
}

// ✅ Good
@GetMapping("/users/{id}")
public UserProfileResponse getUser(@PathVariable Long id) {
    User user = userRepository.findById(id).orElseThrow();
    return mapToResponse(user);
}
```

### 2. Use Validation Annotations
```java
// ✅ Good - Automatic validation
@PostMapping("/reviews")
public ReviewResponse createReview(@Valid @RequestBody ReviewRequest request) {
    // Spring automatically validates before method execution
}
```

### 3. Separate Request and Response DTOs
```java
// ✅ Good - Different DTOs for input/output
public class ReviewRequest { /* input fields */ }
public class ReviewResponse { /* output fields with IDs, timestamps */ }
```

### 4. Include Metadata in Responses
```java
// ✅ Good - Include related data
public class TransactionResponse {
    private Long id;
    private String buyerUsername;  // Not just buyerId
    private String productTitle;   // Not just productId
    private LocalDateTime createdAt;
}
```

---

## 🚀 Next Steps

After DTOs are ready:
1. ✅ Create Service layer with business logic
2. ✅ Implement DTO mappers
3. ✅ Create REST Controllers
4. ✅ Add exception handling
5. ✅ Write integration tests

---

## 📚 Additional Resources

- [Bean Validation Specification](https://beanvalidation.org/2.0/spec/)
- [Spring Validation Guide](https://spring.io/guides/gs/validating-form-input/)
- [Lombok Documentation](https://projectlombok.org/features/)
