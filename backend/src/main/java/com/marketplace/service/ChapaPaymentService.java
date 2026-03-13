package com.marketplace.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChapaPaymentService {

    private final RestTemplate restTemplate;

    @Value("${chapa.secret-key}")
    private String secretKey;

    @Value("${chapa.api-url}")
    private String apiUrl;

    @Value("${chapa.callback-url}")
    private String callbackUrl;

    @Value("${chapa.return-url}")
    private String returnUrl;

    /**
     * Initialize payment with Chapa
     */
    public ChapaInitializeResponse initializePayment(ChapaInitializeRequest request) {
        try {
            String url = apiUrl + "/transaction/initialize";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + secretKey);

            Map<String, Object> body = new HashMap<>();
            body.put("amount", request.getAmount().toString());
            body.put("currency", "ETB");
            body.put("email", request.getEmail());
            body.put("first_name", request.getFirstName());
            body.put("last_name", request.getLastName());
            body.put("tx_ref", request.getTxRef());
            body.put("callback_url", callbackUrl);
            body.put("return_url", returnUrl);
            body.put("customization", Map.of(
                "title", "MarketBridge",
                "description", "Registration fee for " + request.getUserRole()
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                String status = (String) responseBody.get("status");
                
                if ("success".equals(status)) {
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    return ChapaInitializeResponse.builder()
                        .status("success")
                        .message((String) responseBody.get("message"))
                        .checkoutUrl((String) data.get("checkout_url"))
                        .build();
                }
            }

            throw new RuntimeException("Failed to initialize Chapa payment");

        } catch (Exception e) {
            log.error("Error initializing Chapa payment: {}", e.getMessage(), e);
            throw new RuntimeException("Payment initialization failed: " + e.getMessage());
        }
    }

    /**
     * Verify payment with Chapa
     */
    public ChapaVerifyResponse verifyPayment(String txRef) {
        try {
            String url = apiUrl + "/transaction/verify/" + txRef;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + secretKey);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                String status = (String) responseBody.get("status");
                
                if ("success".equals(status)) {
                    Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                    String paymentStatus = (String) data.get("status");
                    
                    return ChapaVerifyResponse.builder()
                        .status(status)
                        .message((String) responseBody.get("message"))
                        .txRef(txRef)
                        .paymentStatus(paymentStatus)
                        .amount(new BigDecimal(data.get("amount").toString()))
                        .currency((String) data.get("currency"))
                        .reference((String) data.get("reference"))
                        .build();
                }
            }

            throw new RuntimeException("Failed to verify Chapa payment");

        } catch (Exception e) {
            log.error("Error verifying Chapa payment: {}", e.getMessage(), e);
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }

    /**
     * Generate unique transaction reference
     */
    public String generateTxRef() {
        return "REG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // DTOs
    @lombok.Data
    @lombok.Builder
    public static class ChapaInitializeRequest {
        private BigDecimal amount;
        private String email;
        private String firstName;
        private String lastName;
        private String txRef;
        private String userRole;
    }

    @lombok.Data
    @lombok.Builder
    public static class ChapaInitializeResponse {
        private String status;
        private String message;
        private String checkoutUrl;
    }

    @lombok.Data
    @lombok.Builder
    public static class ChapaVerifyResponse {
        private String status;
        private String message;
        private String txRef;
        private String paymentStatus;
        private BigDecimal amount;
        private String currency;
        private String reference;
    }
}
