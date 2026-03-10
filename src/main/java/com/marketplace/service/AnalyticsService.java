package com.marketplace.service;

import com.marketplace.dto.AnalyticsOverviewResponse;
import com.marketplace.dto.CategoryAnalyticsResponse;
import com.marketplace.dto.RevenueAnalyticsResponse;
import com.marketplace.dto.SellerAnalyticsResponse;
import com.marketplace.entity.Review;
import com.marketplace.entity.Transaction;
import com.marketplace.entity.User;
import com.marketplace.entity.UserProfile;
import com.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for analytics and reporting
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final ReviewRepository reviewRepository;
    private final UserProfileRepository profileRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Get admin dashboard overview
     */
    public AnalyticsOverviewResponse getOverview() {
        Long totalUsers = userRepository.count();
        Long totalProducts = productRepository.count();
        Long totalTransactions = transactionRepository.count();
        Long successfulTransactions = transactionRepository.countByStatus(Transaction.TransactionStatus.SUCCESS);
        Long pendingTransactions = transactionRepository.countByStatus(Transaction.TransactionStatus.PENDING);
        
        BigDecimal totalRevenue = transactionRepository.calculateTotalRevenue();
        BigDecimal monthlyRevenue = calculateMonthlyRevenue();
        
        Long totalReviews = reviewRepository.count();
        Double averagePlatformRating = calculateAveragePlatformRating();
        
        Long verifiedSellers = profileRepository.countByVerificationStatus(UserProfile.VerificationStatus.VERIFIED);
        Long activeBuyers = countActiveBuyers();

        return AnalyticsOverviewResponse.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalTransactions(totalTransactions)
                .successfulTransactions(successfulTransactions)
                .pendingTransactions(pendingTransactions)
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .totalReviews(totalReviews)
                .averagePlatformRating(averagePlatformRating)
                .verifiedSellers(verifiedSellers)
                .activeBuyers(activeBuyers)
                .build();
    }

    /**
     * Get revenue analytics
     */
    public RevenueAnalyticsResponse getRevenueAnalytics() {
        BigDecimal totalRevenue = transactionRepository.calculateTotalRevenue();
        BigDecimal monthlyRevenue = calculateMonthlyRevenue();
        BigDecimal weeklyRevenue = calculateWeeklyRevenue();
        BigDecimal dailyRevenue = calculateDailyRevenue();

        // Monthly breakdown (last 12 months)
        LocalDateTime twelveMonthsAgo = LocalDateTime.now().minusMonths(12);
        List<Object[]> monthlyData = transactionRepository.getMonthlyRevenue(twelveMonthsAgo);
        List<RevenueAnalyticsResponse.MonthlyRevenueData> monthlyBreakdown = monthlyData.stream()
                .map(row -> RevenueAnalyticsResponse.MonthlyRevenueData.builder()
                        .month(row[0].toString())
                        .revenue((BigDecimal) row[1])
                        .transactionCount(((Number) row[2]).longValue())
                        .build())
                .collect(Collectors.toList());

        // Category breakdown
        List<RevenueAnalyticsResponse.CategoryRevenueData> categoryBreakdown = getCategoryRevenueBreakdown();

        return RevenueAnalyticsResponse.builder()
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .weeklyRevenue(weeklyRevenue)
                .dailyRevenue(dailyRevenue)
                .monthlyBreakdown(monthlyBreakdown)
                .categoryBreakdown(categoryBreakdown)
                .build();
    }

    /**
     * Get category analytics
     */
    public List<CategoryAnalyticsResponse> getCategoryAnalytics() {
        return categoryRepository.findAll().stream()
                .map(category -> {
                    Long productCount = productRepository.countByCategoryIdAndStatus(
                            category.getId(), 
                            com.marketplace.entity.Product.ProductStatus.AVAILABLE
                    );
                    
                    // Calculate transactions and revenue for this category
                    // This would require a custom query in production
                    
                    return CategoryAnalyticsResponse.builder()
                            .categoryId(category.getId())
                            .categoryName(category.getName())
                            .productCount(productCount)
                            .transactionCount(0L) // TODO: Implement
                            .totalRevenue(BigDecimal.ZERO) // TODO: Implement
                            .favoriteCount(0L) // TODO: Implement
                            .averageRating(0.0) // TODO: Implement
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Get seller analytics
     */
    public List<SellerAnalyticsResponse> getTopSellers(int limit) {
        List<Object[]> topSellers = transactionRepository.findTopSellersByRevenue();
        
        return topSellers.stream()
                .limit(limit)
                .map(row -> {
                    User seller = (User) row[0];
                    BigDecimal revenue = (BigDecimal) row[1];
                    
                    Long totalProducts = productRepository.countByOwnerAndStatus(
                            seller, 
                            com.marketplace.entity.Product.ProductStatus.AVAILABLE
                    );
                    Long soldProducts = productRepository.countByOwnerAndStatus(
                            seller, 
                            com.marketplace.entity.Product.ProductStatus.SOLD
                    );
                    Long totalTransactions = transactionRepository.countSellerSuccessfulTransactions(seller);
                    
                    UserProfile profile = profileRepository.findByUser(seller).orElse(null);
                    
                    return SellerAnalyticsResponse.builder()
                            .sellerId(seller.getId())
                            .sellerUsername(seller.getUsername())
                            .sellerEmail(seller.getEmail())
                            .totalProducts(totalProducts + soldProducts)
                            .soldProducts(soldProducts)
                            .totalTransactions(totalTransactions)
                            .totalEarnings(revenue)
                            .averageRating(profile != null ? profile.getAverageRating() : 0.0)
                            .reviewCount(profile != null ? profile.getReviewCount().longValue() : 0L)
                            .verificationStatus(profile != null ? profile.getVerificationStatus().name() : "UNVERIFIED")
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Calculate monthly revenue
     */
    private BigDecimal calculateMonthlyRevenue() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = LocalDateTime.now();
        
        List<Transaction> monthlyTransactions = transactionRepository.findByDateRange(startOfMonth, endOfMonth);
        
        return monthlyTransactions.stream()
                .filter(t -> t.getStatus() == Transaction.TransactionStatus.SUCCESS)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Calculate weekly revenue
     */
    private BigDecimal calculateWeeklyRevenue() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        LocalDateTime now = LocalDateTime.now();
        
        List<Transaction> weeklyTransactions = transactionRepository.findByDateRange(oneWeekAgo, now);
        
        return weeklyTransactions.stream()
                .filter(t -> t.getStatus() == Transaction.TransactionStatus.SUCCESS)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Calculate daily revenue
     */
    private BigDecimal calculateDailyRevenue() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime now = LocalDateTime.now();
        
        List<Transaction> dailyTransactions = transactionRepository.findByDateRange(startOfDay, now);
        
        return dailyTransactions.stream()
                .filter(t -> t.getStatus() == Transaction.TransactionStatus.SUCCESS)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Calculate average platform rating
     */
    private Double calculateAveragePlatformRating() {
        List<Review> approvedReviews = reviewRepository.findByStatusOrderByCreatedAtDesc(Review.ReviewStatus.APPROVED);
        
        if (approvedReviews.isEmpty()) {
            return 0.0;
        }
        
        double sum = approvedReviews.stream()
                .mapToInt(Review::getRating)
                .sum();
        
        return sum / approvedReviews.size();
    }

    /**
     * Count active buyers (users who made at least one purchase)
     */
    private Long countActiveBuyers() {
        return transactionRepository.findByStatusOrderByCreatedAtDesc(Transaction.TransactionStatus.SUCCESS).stream()
                .map(t -> t.getBuyer().getId())
                .distinct()
                .count();
    }

    /**
     * Get category revenue breakdown
     */
    private List<RevenueAnalyticsResponse.CategoryRevenueData> getCategoryRevenueBreakdown() {
        // This would require a custom query joining transactions with products and categories
        // For now, return empty list
        return new ArrayList<>();
    }
}
