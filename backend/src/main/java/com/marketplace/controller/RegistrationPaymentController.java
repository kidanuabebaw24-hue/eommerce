package com.marketplace.controller;

import com.marketplace.dto.RegistrationPaymentRequest;
import com.marketplace.dto.RegistrationPaymentResponse;
import com.marketplace.service.RegistrationPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/registration-payment")
@RequiredArgsConstructor
public class RegistrationPaymentController {

    private final RegistrationPaymentService registrationPaymentService;

    /**
     * Get registration fees
     * GET /api/v1/registration-payment/fees
     */
    @GetMapping("/fees")
    public ResponseEntity<Map<String, BigDecimal>> getRegistrationFees() {
        return ResponseEntity.ok(registrationPaymentService.getRegistrationFees());
    }

    /**
     * Initiate registration payment
     * POST /api/v1/registration-payment/initiate
     */
    @PostMapping("/initiate")
    public ResponseEntity<RegistrationPaymentResponse> initiatePayment(
            @Valid @RequestBody RegistrationPaymentRequest request) {
        return new ResponseEntity<>(
                registrationPaymentService.initiateRegistrationPayment(request), 
                HttpStatus.CREATED
        );
    }

    /**
     * Verify registration payment
     * POST /api/v1/registration-payment/verify/{paymentReference}
     */
    @PostMapping("/verify/{paymentReference}")
    public ResponseEntity<Map<String, String>> verifyPayment(@PathVariable String paymentReference) {
        registrationPaymentService.verifyRegistrationPayment(paymentReference);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Payment verified successfully"
        ));
    }

    /**
     * Chapa webhook callback
     * POST /api/v1/registration-payment/webhook/chapa
     */
    @PostMapping("/webhook/chapa")
    public ResponseEntity<Void> chapaWebhook(@RequestBody Map<String, Object> payload) {
        // Handle Chapa webhook notification
        String txRef = (String) payload.get("tx_ref");
        String status = (String) payload.get("status");
        
        if ("success".equalsIgnoreCase(status) && txRef != null) {
            try {
                registrationPaymentService.verifyRegistrationPayment(txRef);
            } catch (Exception e) {
                // Log error but return 200 to prevent Chapa retries
                return ResponseEntity.ok().build();
            }
        }
        
        return ResponseEntity.ok().build();
    }

    /**
     * Get payment status
     * GET /api/v1/registration-payment/{paymentReference}
     */
    @GetMapping("/{paymentReference}")
    public ResponseEntity<RegistrationPaymentResponse> getPaymentStatus(
            @PathVariable String paymentReference) {
        return ResponseEntity.ok(registrationPaymentService.getPaymentByReference(paymentReference));
    }
}
