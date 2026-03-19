package com.marketplace.service;

import com.marketplace.dto.PaymentInitiateRequest;
import com.marketplace.dto.PaymentInitiateResponse;
import com.marketplace.dto.PaymentResponse;
import com.marketplace.dto.PaymentVerifyRequest;
import com.marketplace.entity.Payment;
import com.marketplace.entity.Transaction;
import com.marketplace.repository.PaymentRepository;
import com.marketplace.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service for payment processing
 * Integrates with payment gateways (Chapa, Stripe, etc.)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    @Value("${payment.gateway.name:chapa}")
    private String gatewayName;

    @Value("${payment.gateway.callback-url:http://localhost:8080/api/v1/payments/callback}")
    private String callbackUrl;

    /**
     * Initiate payment with gateway
     */
    @Transactional
    public PaymentInitiateResponse initiatePayment(PaymentInitiateRequest request) {
        Transaction transaction = transactionRepository.findById(request.getTransactionId())
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Validate transaction is pending
        if (transaction.getStatus() != Transaction.TransactionStatus.PENDING) {
            throw new RuntimeException("Transaction is not in pending state");
        }

        // Generate gateway reference
        String gatewayReference = "PAY-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();

        // Create payment record
        Payment payment = Payment.builder()
                .transaction(transaction)
                .gatewayReference(gatewayReference)
                .gatewayName(gatewayName.toUpperCase())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .status(Payment.PaymentStatus.INITIATED)
                .isVerified(false)
                .build();

        paymentRepository.save(payment);

        // TODO: Integrate with actual payment gateway (Chapa, Stripe)
        // For now, return mock checkout URL
        String checkoutUrl = generateMockCheckoutUrl(gatewayReference, request);

        log.info("Payment initiated: {} for transaction {}", gatewayReference, transaction.getId());

        return PaymentInitiateResponse.builder()
                .checkoutUrl(checkoutUrl)
                .paymentReference(transaction.getPaymentReference())
                .status("INITIATED")
                .message("Payment initiated successfully. Redirect user to checkout URL.")
                .build();
    }

    /**
     * Verify payment (called by gateway callback)
     */
    @Transactional
    public PaymentResponse verifyPayment(PaymentVerifyRequest request) {
        Payment payment = paymentRepository.findByGatewayReference(request.getGatewayReference())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // TODO: Verify with actual payment gateway
        // For now, mark as verified
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setIsVerified(true);
        payment.setVerifiedAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        // Update transaction status
        transactionService.updateTransactionStatus(
                request.getPaymentReference(),
                Transaction.TransactionStatus.SUCCESS
        );

        log.info("Payment verified: {}", request.getGatewayReference());

        return mapToResponse(savedPayment);
    }

    /**
     * Get payment by transaction ID
     */
    public PaymentResponse getPaymentByTransactionId(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Payment payment = paymentRepository.findByTransaction(transaction)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return mapToResponse(payment);
    }

    /**
     * Generate mock checkout URL (replace with actual gateway integration)
     */
    private String generateMockCheckoutUrl(String gatewayReference, PaymentInitiateRequest request) {
        // TODO: Replace with actual Chapa/Stripe checkout URL generation
        return String.format(
                "http://localhost:3000/checkout?ref=%s&amount=%s&currency=%s",
                gatewayReference,
                request.getAmount(),
                request.getCurrency()
        );
    }

    /**
     * Map entity to response DTO
     */
    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .transactionId(payment.getTransaction().getId())
                .gatewayReference(payment.getGatewayReference())
                .gatewayName(payment.getGatewayName())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus().name())
                .isVerified(payment.getIsVerified())
                .verifiedAt(payment.getVerifiedAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    /**
     * CHAPA INTEGRATION EXAMPLE (Uncomment and configure when ready)
     */
    /*
    private String initiateChapaPayment(PaymentInitiateRequest request, String gatewayReference) {
        // Chapa API configuration
        String chapaUrl = "https://api.chapa.co/v1/transaction/initialize";
        String chapaSecretKey = "YOUR_CHAPA_SECRET_KEY";

        // Build request body
        Map<String, Object> chapaRequest = new HashMap<>();
        chapaRequest.put("amount", request.getAmount());
        chapaRequest.put("currency", request.getCurrency());
        chapaRequest.put("email", request.getEmail());
        chapaRequest.put("first_name", request.getFirstName());
        chapaRequest.put("last_name", request.getLastName());
        chapaRequest.put("phone_number", request.getPhoneNumber());
        chapaRequest.put("tx_ref", gatewayReference);
        chapaRequest.put("callback_url", callbackUrl);
        chapaRequest.put("return_url", request.getReturnUrl());

        // Make HTTP request to Chapa
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + chapaSecretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(chapaRequest, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(chapaUrl, entity, Map.class);

        // Extract checkout URL from response
        Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
        return (String) data.get("checkout_url");
    }
    */
}
