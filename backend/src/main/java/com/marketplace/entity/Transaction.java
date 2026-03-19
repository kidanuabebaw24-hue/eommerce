package com.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Transaction Entity - Tracks all purchase transactions
 * Links buyers, sellers, and products with payment status
 */
@Entity
@Table(name = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Buyer who initiated the purchase
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    // Seller who owns the product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    // Product being purchased
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Transaction amount
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    // Transaction status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionStatus status;

    // Payment reference from gateway (Chapa, Stripe, etc.)
    @Column(name = "payment_reference", unique = true)
    private String paymentReference;

    // Payment method used
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    // Additional transaction notes
    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Transaction status enum
    public enum TransactionStatus {
        PENDING,    // Payment initiated but not completed
        SUCCESS,    // Payment successful
        FAILED,     // Payment failed
        CANCELLED,  // Transaction cancelled by user
        REFUNDED    // Payment refunded
    }
}
