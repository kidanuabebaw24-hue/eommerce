package com.marketplace.repository;

import com.marketplace.entity.Transaction;
import com.marketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Transaction entity
 * Handles transaction data access and analytics
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Find transactions by buyer
     */
    List<Transaction> findByBuyerOrderByCreatedAtDesc(User buyer);

    /**
     * Find transactions by seller
     */
    List<Transaction> findBySellerOrderByCreatedAtDesc(User seller);

    /**
     * Find transactions by status
     */
    List<Transaction> findByStatusOrderByCreatedAtDesc(Transaction.TransactionStatus status);

    /**
     * Find transaction by payment reference
     */
    Optional<Transaction> findByPaymentReference(String paymentReference);

    /**
     * Find buyer's transactions by status
     */
    List<Transaction> findByBuyerAndStatus(User buyer, Transaction.TransactionStatus status);

    /**
     * Find seller's transactions by status
     */
    List<Transaction> findBySellerAndStatus(User seller, Transaction.TransactionStatus status);

    /**
     * Find transactions within date range
     */
    @Query("SELECT t FROM Transaction t WHERE t.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);

    /**
     * Calculate total revenue (successful transactions)
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.status = 'SUCCESS'")
    BigDecimal calculateTotalRevenue();

    /**
     * Calculate seller's total earnings
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.seller = :seller AND t.status = 'SUCCESS'")
    BigDecimal calculateSellerEarnings(@Param("seller") User seller);

    /**
     * Calculate buyer's total spending
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.buyer = :buyer AND t.status = 'SUCCESS'")
    BigDecimal calculateBuyerSpending(@Param("buyer") User buyer);

    /**
     * Count transactions by status
     */
    Long countByStatus(Transaction.TransactionStatus status);

    /**
     * Count seller's successful transactions
     */
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.seller = :seller AND t.status = 'SUCCESS'")
    Long countSellerSuccessfulTransactions(@Param("seller") User seller);

    /**
     * Find top sellers by transaction count
     */
    @Query("SELECT t.seller, COUNT(t) as transactionCount FROM Transaction t " +
           "WHERE t.status = 'SUCCESS' GROUP BY t.seller ORDER BY transactionCount DESC")
    List<Object[]> findTopSellersByTransactionCount();

    /**
     * Find top sellers by revenue
     */
    @Query("SELECT t.seller, SUM(t.amount) as totalRevenue FROM Transaction t " +
           "WHERE t.status = 'SUCCESS' GROUP BY t.seller ORDER BY totalRevenue DESC")
    List<Object[]> findTopSellersByRevenue();

    /**
     * Get monthly revenue statistics
     */
    @Query("SELECT FUNCTION('DATE_TRUNC', 'month', t.createdAt) as month, " +
           "SUM(t.amount) as revenue FROM Transaction t " +
           "WHERE t.status = 'SUCCESS' AND t.createdAt >= :startDate " +
           "GROUP BY FUNCTION('DATE_TRUNC', 'month', t.createdAt) " +
           "ORDER BY month DESC")
    List<Object[]> getMonthlyRevenue(@Param("startDate") LocalDateTime startDate);

    /**
     * Check if buyer purchased product
     */
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Transaction t " +
           "WHERE t.buyer = :buyer AND t.product.id = :productId AND t.status = 'SUCCESS'")
    boolean hasBuyerPurchasedProduct(@Param("buyer") User buyer, @Param("productId") Long productId);
}
