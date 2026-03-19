# Database Tables and Properties Detailed List

Below is a detailed breakdown of each table, including every property/column, its data type, SQL constraints, and relationships with other tables.

## 1. `categories` Table (Entity: `Category`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment (`GenerationType.IDENTITY`) |
| `name` | `name` | `String` | Unique, Not Null |
| `description` | `description` | `String` | |

## 2. `favorites` Table (Entity: `Favorite`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `user` | `user_id` | `User` | Foreign Key (`users.id`), Not Null |
| `product` | `product_id` | `Product` | Foreign Key (`products.id`), Not Null |
| `notes` | `notes` | `String` | Column Definition: `TEXT` |
| `createdAt` | `created_at` | `LocalDateTime` | Not Null, Updatable = false |
> **Table Constraints**: Unique constraint on `(user_id, product_id)`.

## 3. `messages` Table (Entity: `Message`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `senderName` | `senderName` | `String` | Not Null |
| `senderEmail` | `senderEmail` | `String` | Not Null |
| `content` | `content` | `String` | Not Null, Column Definition: `TEXT` |
| `product` | `product_id` | `Product` | Foreign Key (`products.id`), Not Null |
| `recipient` | `recipient_id` | `User` | Foreign Key (`users.id`), Not Null |
| `isRead` | `isRead` | `Boolean` | Not Null, Default = `false` |
| `createdAt` | `createdAt` | `LocalDateTime` | Not Null, Updatable = false |

## 4. `payments` Table (Entity: `Payment`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `transaction` | `transaction_id` | `Transaction` | Foreign Key (`transactions.id`), Unique, Not Null |
| `gatewayReference` | `gateway_reference` | `String` | Unique, Not Null |
| `gatewayName` | `gateway_name` | `String` | Length = 50, Not Null |
| `amount` | `amount` | `BigDecimal` | Precision = 10, Scale = 2, Not Null |
| `currency` | `currency` | `String` | Length = 3, Not Null |
| `status` | `status` | `PaymentStatus` | Enum (INITIATED, PENDING, SUCCESS, FAILED, EXPIRED), Not Null, Length = 20 |
| `gatewayResponse` | `gateway_response` | `String` | Column Definition: `TEXT` |
| `isVerified` | `is_verified` | `Boolean` | Not Null, Default = `false` |
| `verifiedAt` | `verified_at` | `LocalDateTime` | |
| `createdAt` | `created_at` | `LocalDateTime` | Not Null, Updatable = false |

## 5. `products` Table (Entity: `Product`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `title` | `title` | `String` | Not Null |
| `description` | `description` | `String` | Column Definition: `TEXT` |
| `price` | `price` | `BigDecimal` | Not Null |
| `location` | `location` | `String` | |
| `status` | `status` | `ProductStatus` | Enum (AVAILABLE, SOLD, SUSPENDED), Default = `AVAILABLE` |
| `owner` | `owner_id` | `User` | Foreign Key (`users.id`), Not Null |
| `category` | `category_id` | `Category` | Foreign Key (`categories.id`) |
| `images` | *(Mapped By Product)*| `List<ProductImage>`| One-to-Many (`product_images` table), Cascade All |
| `createdAt` | `createdAt` | `LocalDateTime` | Set automatically on create (`@PrePersist`) |

## 6. `product_images` Table (Entity: `ProductImage`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `imageUrl` | `imageUrl` | `String` | Not Null |
| `product` | `product_id` | `Product` | Foreign Key (`products.id`), Not Null |

## 7. `reports` Table (Entity: `Report`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `reason` | `reason` | `String` | Not Null |
| `description` | `description` | `String` | Column Definition: `TEXT` |
| `status` | `status` | `ReportStatus` | Enum (PENDING, RESOLVED, DISMISSED), Default = `PENDING` |
| `reporter` | `reporter_id` | `User` | Foreign Key (`users.id`), Not Null |
| `product` | `product_id` | `Product` | Foreign Key (`products.id`), Nullable |
| `service` | `service_id` | `Service` | Foreign Key (`services.id`), Nullable |
| `createdAt` | `createdAt` | `LocalDateTime` | Set automatically on create (`@PrePersist`) |

## 8. `reviews` Table (Entity: `Review`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `rating` | `rating` | `Integer` | Not Null (Must be 1-5) |
| `comment` | `comment` | `String` | Column Definition: `TEXT` |
| `reviewer` | `reviewer_id` | `User` | Foreign Key (`users.id`), Not Null |
| `seller` | `seller_id` | `User` | Foreign Key (`users.id`), Not Null |
| `product` | `product_id` | `Product` | Foreign Key (`products.id`), Not Null |
| `transaction` | `transaction_id` | `Transaction` | Foreign Key (`transactions.id`), Nullable |
| `status` | `status` | `ReviewStatus` | Enum (PENDING, APPROVED, REJECTED, FLAGGED), Length = 20, Not Null |
| `createdAt` | `created_at` | `LocalDateTime` | Not Null, Updatable = false |
| `updatedAt` | `updated_at` | `LocalDateTime` | |
> **Table Constraints**: Unique constraint on `(reviewer_id, product_id)`.

## 9. `roles` Table (Entity: `Role`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `name` | `name` | `String` | Unique, Not Null |

## 10. `services` Table (Entity: `Service`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `serviceName` | `serviceName` | `String` | Not Null |
| `description` | `description` | `String` | Column Definition: `TEXT` |
| `price` | `price` | `BigDecimal` | Not Null |
| `location` | `location` | `String` | |
| `provider` | `provider_id` | `User` | Foreign Key (`users.id`), Not Null |
| `category` | `category_id` | `Category` | Foreign Key (`categories.id`), Nullable |
| `createdAt` | `createdAt` | `LocalDateTime` | Set automatically on create (`@PrePersist`) |

## 11. `transactions` Table (Entity: `Transaction`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `buyer` | `buyer_id` | `User` | Foreign Key (`users.id`), Not Null |
| `seller` | `seller_id` | `User` | Foreign Key (`users.id`), Not Null |
| `product` | `product_id` | `Product` | Foreign Key (`products.id`), Not Null |
| `amount` | `amount` | `BigDecimal` | Precision = 10, Scale = 2, Not Null |
| `status` | `status` | `TransactionStatus` | Enum (PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED), Length = 20, Not Null |
| `paymentReference`| `payment_reference`| `String` | Unique |
| `paymentMethod` | `payment_method` | `String` | Length = 50 |
| `notes` | `notes` | `String` | Column Definition: `TEXT` |
| `createdAt` | `created_at` | `LocalDateTime` | Not Null, Updatable = false |
| `updatedAt` | `updated_at` | `LocalDateTime` | |

## 12. `users` Table (Entity: `User`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `username` | `username` | `String` | Unique, Not Null, Not Blank |
| `fullname` | `fullname` | `String` | |
| `password` | `password` | `String` | Not Null, Not Blank |
| `email` | `email` | `String` | Unique, Not Null, Email |
| `enabled` | `enabled` | `Boolean` | Default = `true` |
| `status` | `status` | `UserStatus` | Enum (PENDING, ACTIVE, SUSPENDED, REJECTED), Default = `PENDING` |
| `roles` | `user_roles` (table)| `Set<Role>` | ManyToMany relationship via `user_roles` join table |
| `userProfile` | *(Mapped By User)* | `UserProfile` | OneToOne relationship (`user_profiles` table) |

## 13. `user_profiles` Table (Entity: `UserProfile`)
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `Long` | Primary Key, Auto Increment |
| `user` | `user_id` | `User` | Foreign Key (`users.id`), Unique, Not Null |
| `profilePhoto` | `profile_photo` | `String` | |
| `bio` | `bio` | `String` | Column Definition: `TEXT` |
| `phone` | `phone` | `String` | Length = 20 |
| `location` | `location` | `String` | Length = 255 |
| `city` | `city` | `String` | Length = 100 |
| `country` | `country` | `String` | Length = 100 |
| `verificationStatus` | `verification_status` | `VerificationStatus`| Enum (UNVERIFIED, PENDING, VERIFIED, REJECTED), Length = 20, Not Null |
| `verificationDocument`| `verification_document`| `String` | |
| `verifiedAt` | `verified_at` | `LocalDateTime` | |
| `facebookUrl` | `facebook_url` | `String` | |
| `twitterUrl` | `twitter_url` | `String` | |
| `linkedinUrl` | `linkedin_url` | `String` | |
| `businessName` | `business_name` | `String` | |
| `businessRegistration`| `business_registration`| `String`| |
| `averageRating` | `average_rating` | `Double` | |
| `reviewCount` | `review_count` | `Integer` | Default = `0` |
| `createdAt` | `created_at` | `LocalDateTime` | Not Null, Updatable = false |
| `updatedAt` | `updated_at` | `LocalDateTime` | |

## 14. `user_roles` Join Table
| Property | Column Name | Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `user` | `user_id` | `User` | Foreign Key (`users.id`) |
| `role` | `role_id` | `Role` | Foreign Key (`roles.id`) |
