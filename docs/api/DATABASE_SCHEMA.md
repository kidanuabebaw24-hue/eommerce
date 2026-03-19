# MarketBridge Database Schema Documentation

## Overview
This document describes the complete database schema for the MarketBridge marketplace platform.

## Entity Relationship Diagram (ERD)

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    User     │───────│ UserProfile  │       │   Product   │
│             │ 1:1   │              │       │             │
└─────────────┘       └──────────────┘       └─────────────┘
      │                                              │
      │ 1:N                                          │
      ├──────────────────────────────────────────────┤
      │                                              │
      ▼                                              ▼
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│ Transaction │───────│   Payment    │       │  Favorite   │
│             │ 1:1   │              │       │             │
└─────────────┘       └──────────────┘       └─────────────┘
      │
      │ 1:N
      ▼
┌─────────────┐
│   Review    │
│             │
└─────────────┘
```

## Tables

### 1. user_profiles
Extended user information beyond authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | BIGINT | FOREIGN KEY, UNIQUE, NOT NULL | Reference to users table |
| profile_photo | VARCHAR(255) | | URL to profile photo |
| bio | TEXT | | User biography |
| phone | VARCHAR(20) | | Contact phone number |
| location | VARCHAR(255) | | User location/address |
| city | VARCHAR(100) | | City name |
| country | VARCHAR(100) | | Country name |
| verification_status | VARCHAR(20) | NOT NULL | UNVERIFIED, PENDING, VERIFIED, REJECTED |
| verification_document | VARCHAR(255) | | URL to verification document |
| verified_at | TIMESTAMP | | Verification completion date |
| facebook_url | VARCHAR(255) | | Facebook profile link |
| twitter_url | VARCHAR(255) | | Twitter profile link |
| linkedin_url | VARCHAR(255) | | LinkedIn profile link |
| business_name | VARCHAR(255) | | Business name (for sellers) |
| business_registration | VARCHAR(255) | | Business registration number |
| average_rating | DECIMAL(3,2) | | Calculated average rating |
| review_count | INTEGER | DEFAULT 0 | Total reviews received |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | | Last update timestamp |

**Indexes:**
- `idx_user_id` on user_id
- `idx_verification_status` on verification_status

---

### 2. transactions
Tracks all purchase transactions between buyers and sellers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| buyer_id | BIGINT | FOREIGN KEY, NOT NULL | Reference to users (buyer) |
| seller_id | BIGINT | FOREIGN KEY, NOT NULL | Reference to users (seller) |
| product_id | BIGINT | FOREIGN KEY, NOT NULL | Reference to products |
| amount | DECIMAL(10,2) | NOT NULL | Transaction amount |
| status | VARCHAR(20) | NOT NULL | PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED |
| payment_reference | VARCHAR(255) | UNIQUE | Payment gateway reference |
| payment_method | VARCHAR(50) | | Payment method used |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | | Last update timestamp |

**Indexes:**
- `idx_buyer_id` on buyer_id
- `idx_seller_id` on seller_id
- `idx_product_id` on product_id
- `idx_status` on status
- `idx_payment_reference` on payment_reference
- `idx_created_at` on created_at

---

### 3. payments
Detailed payment information from payment gateways.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| transaction_id | BIGINT | FOREIGN KEY, UNIQUE, NOT NULL | Reference to transactions |
| gateway_reference | VARCHAR(255) | UNIQUE, NOT NULL | Gateway transaction ID |
| gateway_name | VARCHAR(50) | NOT NULL | Payment gateway name (Chapa, Stripe) |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| currency | VARCHAR(3) | NOT NULL | Currency code (ETB, USD) |
| status | VARCHAR(20) | NOT NULL | INITIATED, PENDING, SUCCESS, FAILED, EXPIRED |
| gateway_response | TEXT | | Raw gateway response (JSON) |
| is_verified | BOOLEAN | NOT NULL, DEFAULT FALSE | Verification status |
| verified_at | TIMESTAMP | | Verification timestamp |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |

**Indexes:**
- `idx_transaction_id` on transaction_id
- `idx_gateway_reference` on gateway_reference
- `idx_status` on status

---

### 4. favorites
User's wishlist/saved products.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | BIGINT | FOREIGN KEY, NOT NULL | Reference to users |
| product_id | BIGINT | FOREIGN KEY, NOT NULL | Reference to products |
| notes | TEXT | | Optional notes |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |

**Constraints:**
- UNIQUE(user_id, product_id) - User can't favorite same product twice

**Indexes:**
- `idx_user_id` on user_id
- `idx_product_id` on product_id

---

### 5. reviews
Product and seller reviews from buyers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| rating | INTEGER | NOT NULL, CHECK (1-5) | Rating from 1 to 5 stars |
| comment | TEXT | | Review comment |
| reviewer_id | BIGINT | FOREIGN KEY, NOT NULL | Reference to users (buyer) |
| seller_id | BIGINT | FOREIGN KEY, NOT NULL | Reference to users (seller) |
| product_id | BIGINT | FOREIGN KEY, NOT NULL | Reference to products |
| transaction_id | BIGINT | FOREIGN KEY | Reference to transactions |
| status | VARCHAR(20) | NOT NULL | PENDING, APPROVED, REJECTED, FLAGGED |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | | Last update timestamp |

**Constraints:**
- UNIQUE(reviewer_id, product_id) - One review per product per user
- CHECK(rating >= 1 AND rating <= 5)

**Indexes:**
- `idx_reviewer_id` on reviewer_id
- `idx_seller_id` on seller_id
- `idx_product_id` on product_id
- `idx_rating` on rating
- `idx_status` on status

---

## Relationships

### User → UserProfile (1:1)
- Each user has exactly one profile
- Profile is created automatically on user registration

### User → Transaction (1:N as buyer)
- A user can have multiple transactions as a buyer

### User → Transaction (1:N as seller)
- A user can have multiple transactions as a seller

### Product → Transaction (1:N)
- A product can be involved in multiple transactions

### Transaction → Payment (1:1)
- Each transaction has exactly one payment record

### User → Favorite (1:N)
- A user can favorite multiple products

### Product → Favorite (1:N)
- A product can be favorited by multiple users

### User → Review (1:N as reviewer)
- A user can write multiple reviews

### User → Review (1:N as seller)
- A seller can receive multiple reviews

### Product → Review (1:N)
- A product can have multiple reviews

### Transaction → Review (1:1)
- A review is linked to a specific transaction

---

## Database Migration Notes

### For PostgreSQL:
The schema will be automatically created by Hibernate with `ddl-auto: update`.

### Manual SQL (if needed):
```sql
-- Create indexes for better query performance
CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

CREATE INDEX idx_reviews_seller_id ON reviews(seller_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

CREATE INDEX idx_user_profiles_verification_status ON user_profiles(verification_status);
```

---

## Data Integrity Rules

1. **Transactions**: Cannot be deleted, only status updated
2. **Reviews**: Can only be created by verified buyers who completed a transaction
3. **Favorites**: Automatically removed if product is deleted
4. **UserProfile**: Created automatically when user registers
5. **Payments**: Immutable once verified

---

## Estimated Storage Requirements

For 10,000 users:
- user_profiles: ~5 MB
- transactions: ~2 MB (assuming 20,000 transactions)
- payments: ~3 MB
- favorites: ~1 MB (assuming 50,000 favorites)
- reviews: ~10 MB (assuming 30,000 reviews)

**Total: ~21 MB** (excluding existing tables)

---

## Next Steps

After database schema is ready:
1. Create JPA Repositories
2. Create DTOs for API requests/responses
3. Implement Service layer
4. Create REST Controllers
5. Add security configurations
6. Build frontend components
