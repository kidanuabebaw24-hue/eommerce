package com.marketplace.repository;

import com.marketplace.entity.Payment;
import com.marketplace.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Payment entity
 * Handles payment gateway data access
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Find payment by transaction
     */
    Optional<Payment> findByTransaction(Transaction transaction);

    /**
     * Find payment by gateway reference
     */
    Optional<Payment> findByGatewayReference(String gatewayReference);

    /**
     * Find payments by status
     */
    List<Payment> findByStatusOrderByCreatedAtDesc(Payment.PaymentStatus status);

    /**
     * Find payments by gateway name
     */
    List<Payment> findByGatewayNameOrderByCreatedAtDesc(String gatewayName);

    /**
     * Find unverified payments
     */
    List<Payment> findByIsVerifiedFalseOrderByCreatedAtDesc();

    /**
     * Find payments within date range
     */
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY p.createdAt DESC")
    List<Payment> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate);

    /**
     * Count payments by status
     */
    Long countByStatus(Payment.PaymentStatus status);

    /**
     * Count unverified payments
     */
    Long countByIsVerifiedFalse();

    /**
     * Find pending payments older than specified time
     */
    @Query("SELECT p FROM Payment p WHERE p.status = 'PENDING' " +
           "AND p.createdAt < :cutoffTime ORDER BY p.createdAt ASC")
    List<Payment> findPendingPaymentsOlderThan(@Param("cutoffTime") LocalDateTime cutoffTime);

    /**
     * Check if gateway reference exists
     */
    boolean existsByGatewayReference(String gatewayReference);
}
