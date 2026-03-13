package com.marketplace.controller;

import com.marketplace.dto.TransactionRequest;
import com.marketplace.dto.TransactionResponse;
import com.marketplace.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for transactions
 */
@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Create a new transaction (initiate purchase)
     * POST /api/v1/transactions
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        return new ResponseEntity<>(transactionService.createTransaction(request), HttpStatus.CREATED);
    }

    /**
     * Get transaction by ID
     * GET /api/v1/transactions/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    /**
     * Get transaction by payment reference
     * GET /api/v1/transactions/reference/{paymentReference}
     */
    @GetMapping("/reference/{paymentReference}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TransactionResponse> getTransactionByReference(@PathVariable String paymentReference) {
        return ResponseEntity.ok(transactionService.getTransactionByReference(paymentReference));
    }

    /**
     * Get my purchases (as buyer)
     * GET /api/v1/transactions/purchases
     */
    @GetMapping("/purchases")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TransactionResponse>> getMyPurchases() {
        return ResponseEntity.ok(transactionService.getMyPurchases());
    }

    /**
     * Get my sales (as seller)
     * GET /api/v1/transactions/sales
     */
    @GetMapping("/sales")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<List<TransactionResponse>> getMySales() {
        return ResponseEntity.ok(transactionService.getMySales());
    }

    /**
     * Get seller's earnings
     * GET /api/v1/transactions/seller/{sellerId}/earnings
     */
    @GetMapping("/seller/{sellerId}/earnings")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<BigDecimal> getSellerEarnings(@PathVariable Long sellerId) {
        return ResponseEntity.ok(transactionService.getSellerEarnings(sellerId));
    }

    /**
     * Get buyer's spending
     * GET /api/v1/transactions/buyer/{buyerId}/spending
     */
    @GetMapping("/buyer/{buyerId}/spending")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BigDecimal> getBuyerSpending(@PathVariable Long buyerId) {
        return ResponseEntity.ok(transactionService.getBuyerSpending(buyerId));
    }
}
