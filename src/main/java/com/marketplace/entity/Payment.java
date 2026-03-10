package com.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment Entity - Detailed payment information
 * Stores gateway-specific data and verification details
 */
@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to transaction
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false, unique = true)
    private Transaction transaction;

    // Payment gateway reference (from Chapa, Stripe, etc.)
    @Column(name = "gateway_reference", unique = true, nullable = false)
    private String gatewayReference;

    // Payment gateway name
    @Column(name = "gateway_name", nullable = false, length = 50)
    private String gatewayName;

    // Amount paid
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    // Currency code (ETB, USD, etc.)
    @Column(length = 3, nullable = false)
    private String currency;

    // Payment status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    // Gateway response data (JSON format)
    @Column(name = "gateway_response", columnDefinition = "TEXT")
    private String gatewayResponse;

    // Verification status
    @Builder.Default
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    // Verification timestamp
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Payment status enum
    public enum PaymentStatus {
        INITIATED,  // Payment process started
        PENDING,    // Waiting for payment confirmation
        SUCCESS,    // Payment successful
        FAILED,     // Payment failed
        EXPIRED     // Payment link expired
    }
}
