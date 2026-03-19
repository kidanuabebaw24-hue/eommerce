# MarketBridge API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

---

## 🔐 Authentication

All authenticated endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 📦 API Endpoints

### 1. FAVORITES API

#### Add to Favorites
```http
POST /api/v1/favorites/{productId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "userId": 10,
  "productId": 123,
  "productTitle": "MacBook Pro",
  "productPrice": 15000.00,
  "createdAt": "2024-03-09T10:00:00"
}
```

#### Remove from Favorites
```http
DELETE /api/v1/favorites/{productId}
Authorization: Bearer <token>
```

#### Get My Favorites
```http
GET /api/v1/favorites
Authorization: Bearer <token>
```

#### Check if Favorited
```http
GET /api/v1/favorites/{productId}/check
Authorization: Bearer <token>
```

**Response:** `true` or `false`

---

### 2. REVIEWS API

#### Create Review
```http
POST /api/v1/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product and fast delivery!",
  "productId": 123,
  "transactionId": 456
}
```

**Validation:**
- Rating: 1-5 (required)
- Comment: 10-1000 characters (required)
- Must have purchased the product
- One review per product per user

#### Get Product Reviews
```http
GET /api/v1/reviews/product/{productId}
```

#### Get Seller Reviews
```http
GET /api/v1/reviews/seller/{sellerId}
```

#### Get My Reviews
```http
GET /api/v1/reviews/my-reviews
Authorization: Bearer <token>
```

#### Get Rating Distribution
```http
GET /api/v1/reviews/product/{productId}/distribution
GET /api/v1/reviews/seller/{sellerId}/distribution
```

**Response:**
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
  "fourStarPercentage": 25.0
}
```

---

### 3. TRANSACTIONS API

#### Create Transaction (Initiate Purchase)
```http
POST /api/v1/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 123,
  "amount": 15000.00,
  "paymentMethod": "chapa",
  "notes": "Please deliver to office"
}
```

**Response:**
```json
{
  "id": 456,
  "buyerId": 10,
  "sellerId": 20,
  "productId": 123,
  "amount": 15000.00,
  "status": "PENDING",
  "paymentReference": "TXN-ABC12345",
  "createdAt": "2024-03-09T10:00:00"
}
```

#### Get Transaction by ID
```http
GET /api/v1/transactions/{id}
Authorization: Bearer <token>
```

#### Get My Purchases
```http
GET /api/v1/transactions/purchases
Authorization: Bearer <token>
```

#### Get My Sales
```http
GET /api/v1/transactions/sales
Authorization: Bearer <token>
```

#### Get Seller Earnings
```http
GET /api/v1/transactions/seller/{sellerId}/earnings
Authorization: Bearer <token>
```

---

### 4. PAYMENTS API

#### Initiate Payment
```http
POST /api/v1/payments/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "transactionId": 456,
  "amount": 15000.00,
  "currency": "ETB",
  "email": "buyer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+251911234567",
  "returnUrl": "https://marketbridge.com/payment/success"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://checkout.chapa.co/pay/abc123",
  "paymentReference": "TXN-ABC12345",
  "status": "INITIATED",
  "message": "Payment initiated successfully"
}
```

**Frontend Flow:**
```javascript
// 1. Create transaction
const transaction = await createTransaction(productId, amount);

// 2. Initiate payment
const payment = await initiatePayment(transaction.id);

// 3. Redirect to checkout
window.location.href = payment.checkoutUrl;

// 4. User completes payment on gateway

// 5. Gateway calls webhook to verify payment

// 6. User redirected back to returnUrl
```

#### Verify Payment
```http
POST /api/v1/payments/verify
Content-Type: application/json

{
  "paymentReference": "TXN-ABC12345",
  "gatewayReference": "CHAPA-XYZ789"
}
```

---

### 5. USER PROFILE API

#### Get My Profile
```http
GET /api/v1/profile
Authorization: Bearer <token>
```

#### Get Profile by User ID
```http
GET /api/v1/profile/user/{userId}
```

#### Update My Profile
```http
PUT /api/v1/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Experienced seller of electronics",
  "phone": "+251911234567",
  "location": "Bole, Addis Ababa",
  "city": "Addis Ababa",
  "country": "Ethiopia",
  "businessName": "Tech Solutions Ltd"
}
```

#### Upload Profile Photo
```http
POST /api/v1/profile/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image-file>
```

#### Get Top Sellers
```http
GET /api/v1/profile/top-sellers
```

#### Get Verified Sellers
```http
GET /api/v1/profile/verified-sellers?minRating=4.0
```

---

### 6. PRODUCT SEARCH API

#### Advanced Search
```http
GET /api/v1/products/search?categoryId=1&minPrice=5000&maxPrice=20000&location=Addis&minRating=4.0&searchTerm=laptop&page=0&size=20
```

**Query Parameters:**
- `categoryId`: Filter by category ID
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `location`: Filter by location (partial match)
- `minRating`: Minimum seller rating
- `postedAfter`: ISO date (e.g., 2024-01-01T00:00:00)
- `status`: AVAILABLE, SOLD, PENDING
- `searchTerm`: Search in title/description
- `page`: Page number (default 0)
- `size`: Page size (default 20)
- `sortBy`: Sort field (default createdAt)
- `sortDirection`: ASC or DESC (default DESC)

**Response:**
```json
{
  "content": [...products...],
  "totalElements": 150,
  "totalPages": 8,
  "size": 20,
  "number": 0
}
```

#### Quick Search
```http
GET /api/v1/products/quick-search?q=laptop&page=0&size=20
```

#### Get Featured Products
```http
GET /api/v1/products/featured?minRating=4.0&limit=10
```

---

### 7. ANALYTICS API (Admin Only)

#### Get Dashboard Overview
```http
GET /api/v1/analytics/overview
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "totalUsers": 5000,
  "totalProducts": 12000,
  "totalTransactions": 8500,
  "successfulTransactions": 8000,
  "totalRevenue": 25000000.00,
  "monthlyRevenue": 2500000.00,
  "averagePlatformRating": 4.5,
  "verifiedSellers": 1200
}
```

#### Get Revenue Analytics
```http
GET /api/v1/analytics/revenue
Authorization: Bearer <admin-token>
```

#### Get Category Analytics
```http
GET /api/v1/analytics/categories
Authorization: Bearer <admin-token>
```

#### Get Top Sellers
```http
GET /api/v1/analytics/top-sellers?limit=10
Authorization: Bearer <admin-token>
```

---

## 🔒 Security & Permissions

### Role-Based Access

| Endpoint | Roles | Description |
|----------|-------|-------------|
| `/api/v1/favorites/**` | Authenticated | Wishlist management |
| `/api/v1/reviews` (POST) | BUYER, ADMIN | Create review |
| `/api/v1/transactions` (POST) | BUYER, ADMIN | Create transaction |
| `/api/v1/transactions/sales` | SELLER, ADMIN | View sales |
| `/api/v1/payments/initiate` | BUYER, ADMIN | Initiate payment |
| `/api/v1/profile` (PUT) | Authenticated | Update profile |
| `/api/v1/analytics/**` | ADMIN | Analytics dashboard |

### Public Endpoints (No Auth Required)

- `GET /api/v1/products/**` - View products
- `GET /api/v1/reviews/**` - View reviews
- `GET /api/v1/profile/user/{id}` - View public profiles
- `POST /api/v1/payments/verify` - Payment webhook
- `POST /api/v1/payments/callback` - Gateway callback

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful deletion) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🧪 Testing with cURL

### Create Transaction
```bash
curl -X POST http://localhost:8080/api/v1/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 123,
    "amount": 15000.00
  }'
```

### Add to Favorites
```bash
curl -X POST http://localhost:8080/api/v1/favorites/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Products
```bash
curl "http://localhost:8080/api/v1/products/search?categoryId=1&minPrice=5000&maxPrice=20000"
```

---

## 🚀 Next Steps

1. ✅ Test all endpoints with Postman/cURL
2. ✅ Integrate payment gateway (Chapa)
3. ✅ Build frontend components
4. ✅ Add API rate limiting
5. ✅ Implement caching
6. ✅ Add Swagger/OpenAPI documentation

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in BigDecimal (2 decimal places)
- Pagination uses zero-based indexing
- Default page size is 20 items
- Maximum page size is 100 items
