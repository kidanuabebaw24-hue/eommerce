package com.marketplace.controller;

import com.marketplace.dto.PaymentInitiateRequest;
import com.marketplace.dto.PaymentInitiateResponse;
import com.marketplace.dto.PaymentResponse;
import com.marketplace.dto.PaymentVerifyRequest;
import com.marketplace.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for payment processing
 */
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Initiate payment
     * POST /api/v1/payments/initiate
     */
    @PostMapping("/initiate")
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    public ResponseEntity<PaymentInitiateResponse> initiatePayment(@Valid @RequestBody PaymentInitiateRequest request) {
        return new ResponseEntity<>(paymentService.initiatePayment(request), HttpStatus.CREATED);
    }

    /**
     * Verify payment (webhook/callback from gateway)
     * POST /api/v1/payments/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }

    /**
     * Get payment by transaction ID
     * GET /api/v1/payments/transaction/{transactionId}
     */
    @GetMapping("/transaction/{transactionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponse> getPaymentByTransactionId(@PathVariable Long transactionId) {
        return ResponseEntity.ok(paymentService.getPaymentByTransactionId(transactionId));
    }

    /**
     * Payment callback endpoint (for gateway webhooks)
     * POST /api/v1/payments/callback
     */
    @PostMapping("/callback")
    public ResponseEntity<String> paymentCallback(@RequestBody String payload) {
        // TODO: Implement gateway-specific callback handling
        // Parse payload, verify signature, update payment status
        return ResponseEntity.ok("Callback received");
    }
}
