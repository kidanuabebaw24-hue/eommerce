package com.marketplace.service;

import com.marketplace.dto.CompleteRegistrationRequest;
import com.marketplace.dto.RegistrationPaymentRequest;
import com.marketplace.dto.RegistrationPaymentResponse;
import com.marketplace.entity.RegistrationPayment;
import com.marketplace.repository.RegistrationPaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationPaymentService {

    private final RegistrationPaymentRepository registrationPaymentRepository;
    private final ChapaPaymentService chapaPaymentService;

    @Value("${registration.fee.buyer:10.00}")
    private BigDecimal buyerRegistrationFee;

    @Value("${registration.fee.seller:50.00}")
    private BigDecimal sellerRegistrationFee;

    /**
     * Initiate registration payment
     */
    @Transactional
    public RegistrationPaymentResponse initiateRegistrationPayment(RegistrationPaymentRequest request) {
        // Check if email already has a successful payment
        if (registrationPaymentRepository.existsByEmailAndStatus(request.getEmail(), 
                RegistrationPayment.PaymentStatus.SUCCESS)) {
            throw new RuntimeException("This email has already been used for registration");
        }

        // Validate amount based on role
        BigDecimal expectedAmount = request.getUserRole().equalsIgnoreCase("SELLER") 
                ? sellerRegistrationFee 
                : buyerRegistrationFee;

        if (request.getAmount().compareTo(expectedAmount) != 0) {
            throw new RuntimeException("Invalid registration fee amount");
        }

        // Generate unique payment reference
        String paymentReference = chapaPaymentService.generateTxRef();

        // Create registration payment record
        RegistrationPayment payment = RegistrationPayment.builder()
                .paymentReference(paymentReference)
                .email(request.getEmail())
                .fullName(request.getFullName())
                .username(request.getUsername())
                .userRole(RegistrationPayment.UserRole.valueOf(request.getUserRole().toUpperCase()))
                .amount(request.getAmount())
                .status(RegistrationPayment.PaymentStatus.PENDING)
                .paymentMethod("CHAPA")
                .isVerified(false)
                .build();

        RegistrationPayment savedPayment = registrationPaymentRepository.save(payment);

        log.info("Registration payment initiated: {} for user {}", paymentReference, request.getEmail());

        // Initialize Chapa payment
        String[] nameParts = request.getFullName().split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        ChapaPaymentService.ChapaInitializeRequest chapaRequest = ChapaPaymentService.ChapaInitializeRequest.builder()
                .amount(request.getAmount())
                .email(request.getEmail())
                .firstName(firstName)
                .lastName(lastName)
                .txRef(paymentReference)
                .userRole(request.getUserRole())
                .build();

        ChapaPaymentService.ChapaInitializeResponse chapaResponse = 
                chapaPaymentService.initializePayment(chapaRequest);

        return mapToResponse(savedPayment, chapaResponse.getCheckoutUrl());
    }

    /**
     * Verify registration payment
     */
    @Transactional
    public void verifyRegistrationPayment(String paymentReference) {
        RegistrationPayment payment = registrationPaymentRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getIsVerified()) {
            throw new RuntimeException("Payment already verified");
        }

        // Verify with Chapa
        ChapaPaymentService.ChapaVerifyResponse chapaResponse = 
                chapaPaymentService.verifyPayment(paymentReference);

        // Check if payment was successful
        if ("success".equalsIgnoreCase(chapaResponse.getPaymentStatus())) {
            payment.setStatus(RegistrationPayment.PaymentStatus.SUCCESS);
            payment.setIsVerified(true);
            payment.setVerifiedAt(LocalDateTime.now());
            
            registrationPaymentRepository.save(payment);
            log.info("Registration payment verified: {}", paymentReference);
        } else {
            payment.setStatus(RegistrationPayment.PaymentStatus.FAILED);
            registrationPaymentRepository.save(payment);
            throw new RuntimeException("Payment verification failed: " + chapaResponse.getPaymentStatus());
        }
    }

    /**
     * Get registration payment by reference
     */
    public RegistrationPaymentResponse getPaymentByReference(String paymentReference) {
        RegistrationPayment payment = registrationPaymentRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return mapToResponse(payment, null);
    }

    /**
     * Check if email has paid registration fee
     */
    public boolean hasValidRegistrationPayment(String email) {
        return registrationPaymentRepository.existsByEmailAndStatus(email, 
                RegistrationPayment.PaymentStatus.SUCCESS);
    }


    /**
     * Check if payment is valid for registration
     */
    public boolean isPaymentValidForRegistration(String paymentReference) {
        return registrationPaymentRepository.findByPaymentReference(paymentReference)
                .map(payment -> payment.getStatus() == RegistrationPayment.PaymentStatus.SUCCESS 
                        && payment.getIsVerified() 
                        && !payment.getIsUsed())
                .orElse(false);
    }

    /**
     * Mark payment as used after successful registration
     */
    @Transactional
    public void markPaymentAsUsed(String paymentReference) {
        RegistrationPayment payment = registrationPaymentRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getIsUsed()) {
            throw new RuntimeException("Payment has already been used");
        }

        payment.setIsUsed(true);
        registrationPaymentRepository.save(payment);

        log.info("Registration payment marked as used: {}", paymentReference);
    }

    /**
     * Get registration fees
     */
    public java.util.Map<String, BigDecimal> getRegistrationFees() {
        java.util.Map<String, BigDecimal> fees = new java.util.HashMap<>();
        fees.put("BUYER", buyerRegistrationFee);
        fees.put("SELLER", sellerRegistrationFee);
        return fees;
    }

    /**
     * Map entity to response DTO
     */
    private RegistrationPaymentResponse mapToResponse(RegistrationPayment payment, String checkoutUrl) {
        return RegistrationPaymentResponse.builder()
                .id(payment.getId())
                .paymentReference(payment.getPaymentReference())
                .email(payment.getEmail())
                .fullName(payment.getFullName())
                .username(payment.getUsername())
                .userRole(payment.getUserRole().name())
                .amount(payment.getAmount())
                .status(payment.getStatus().name())
                .paymentMethod(payment.getPaymentMethod())
                .isVerified(payment.getIsVerified())
                .createdAt(payment.getCreatedAt())
                .checkoutUrl(checkoutUrl)
                .build();
    }

}
