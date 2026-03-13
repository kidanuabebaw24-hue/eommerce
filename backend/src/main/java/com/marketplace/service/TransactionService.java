package com.marketplace.service;

import com.marketplace.dto.TransactionRequest;
import com.marketplace.dto.TransactionResponse;
import com.marketplace.entity.Product;
import com.marketplace.entity.Transaction;
import com.marketplace.entity.User;
import com.marketplace.repository.ProductRepository;
import com.marketplace.repository.TransactionRepository;
import com.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for transaction management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    /**
     * Create a new transaction (initiate purchase)
     */
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Validate product is available
        if (product.getStatus() != Product.ProductStatus.AVAILABLE) {
            throw new RuntimeException("Product is not available for purchase");
        }

        // Validate buyer is not the seller
        if (product.getOwner().getId().equals(buyer.getId())) {
            throw new RuntimeException("You cannot purchase your own product");
        }

        // Validate amount matches product price
        if (request.getAmount().compareTo(product.getPrice()) != 0) {
            throw new RuntimeException("Amount does not match product price");
        }

        // Generate unique payment reference
        String paymentReference = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Create transaction
        Transaction transaction = Transaction.builder()
                .buyer(buyer)
                .seller(product.getOwner())
                .product(product)
                .amount(request.getAmount())
                .status(Transaction.TransactionStatus.PENDING)
                .paymentReference(paymentReference)
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Transaction created: {} for product {} by buyer {}", 
                paymentReference, product.getId(), username);

        return mapToResponse(savedTransaction);
    }

    /**
     * Get transaction by ID
     */
    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Validate user is buyer or seller
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!transaction.getBuyer().getUsername().equals(username) &&
            !transaction.getSeller().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized to view this transaction");
        }

        return mapToResponse(transaction);
    }

    /**
     * Get transaction by payment reference
     */
    public TransactionResponse getTransactionByReference(String paymentReference) {
        Transaction transaction = transactionRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        return mapToResponse(transaction);
    }

    /**
     * Get buyer's transactions
     */
    public List<TransactionResponse> getMyPurchases() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByBuyerOrderByCreatedAtDesc(buyer).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get seller's transactions
     */
    public List<TransactionResponse> getMySales() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findBySellerOrderByCreatedAtDesc(seller).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update transaction status (internal use)
     */
    @Transactional
    public void updateTransactionStatus(String paymentReference, Transaction.TransactionStatus status) {
        Transaction transaction = transactionRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setStatus(status);
        transactionRepository.save(transaction);

        // If successful, mark product as sold
        if (status == Transaction.TransactionStatus.SUCCESS) {
            Product product = transaction.getProduct();
            product.setStatus(Product.ProductStatus.SOLD);
            productRepository.save(product);
            log.info("Product {} marked as SOLD", product.getId());
        }

        log.info("Transaction {} status updated to {}", paymentReference, status);
    }

    /**
     * Calculate seller's earnings
     */
    public BigDecimal getSellerEarnings(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        return transactionRepository.calculateSellerEarnings(seller);
    }

    /**
     * Calculate buyer's spending
     */
    public BigDecimal getBuyerSpending(Long buyerId) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        return transactionRepository.calculateBuyerSpending(buyer);
    }

    /**
     * Map entity to response DTO
     */
    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .buyerId(transaction.getBuyer().getId())
                .buyerUsername(transaction.getBuyer().getUsername())
                .sellerId(transaction.getSeller().getId())
                .sellerUsername(transaction.getSeller().getUsername())
                .productId(transaction.getProduct().getId())
                .productTitle(transaction.getProduct().getTitle())
                .amount(transaction.getAmount())
                .status(transaction.getStatus().name())
                .paymentReference(transaction.getPaymentReference())
                .paymentMethod(transaction.getPaymentMethod())
                .notes(transaction.getNotes())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
