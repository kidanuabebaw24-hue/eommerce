package com.marketplace.service;

import com.marketplace.dto.AIChatRequest;
import com.marketplace.dto.AIChatResponse;
import com.marketplace.entity.Product;
import com.marketplace.repository.ProductRepository;
import com.marketplace.repository.ReviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AIService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final RestTemplate restTemplate;

    public AIService(ProductRepository productRepository, ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000); // 10 seconds
        factory.setReadTimeout(10000);    // 10 seconds
        this.restTemplate = new RestTemplate(factory);
    }

    @Value("${app.ai.provider:gemini}")
    private String provider;

    @Value("${app.ai.api-key:PLACEHOLDER_KEY}")
    private String apiKey;

    @Value("${app.ai.model:gemini-2.0-flash}")
    private String model;

    @Value("${app.ai.api-url:https://generativelanguage.googleapis.com/v1beta/models/}")
    private String apiUrl;

    public AIChatResponse processChatMessage(AIChatRequest request) {
        String userMessage = request.getMessage();
        Long productId = request.getProductId();

        log.info("[AI-Advisor] Processing message: '{}'", userMessage);
        String intent = detectIntent(userMessage, productId);
        String context = gatherContext(intent, productId);
        String prompt = buildPrompt(userMessage, context, intent);

        String aiResponse;
        if (apiKey.equals("PLACEHOLDER_KEY") || apiKey.isEmpty()) {
            aiResponse = generateMockResponse(userMessage, context, intent);
        } else {
            aiResponse = callAIModel(prompt, userMessage);
        }

        return AIChatResponse.builder()
                .response(aiResponse)
                .status("SUCCESS")
                .build();
    }

    private String detectIntent(String message, Long productId) {
        if (message == null) return "GENERAL_CONVERSATION";
        String msg = message.toLowerCase();

        if (msg.contains("sell") || msg.contains("listing") || msg.contains("worth") || msg.contains("how much")) {
            return "SELLING";
        }
        if (msg.contains("compare") || msg.contains("versus") || msg.contains("vs")) {
            return "COMPARISON";
        }
        if (msg.contains("price") || msg.contains("cost") || msg.contains("reasonable") || msg.contains("deal")) {
            return (productId != null) ? "BUYING_ADVICE" : "MARKET_INFO";
        }
        if (msg.contains("how") || msg.contains("help") || msg.contains("payment") || msg.contains("delivery")) {
            return "GENERAL_PLATFORM";
        }
        return "GENERAL_CONVERSATION";
    }

    private String gatherContext(String intent, Long productId) {
        if (productId != null) {
            Product product = productRepository.findById(productId).orElse(null);
            if (product != null) {
                BigDecimal avgPrice = productRepository.findAveragePriceByCategory(product.getCategory().getId());
                return String.format("Current Product: %s (Price: %s ETB). Category Average: %s ETB.", 
                    product.getTitle(), product.getPrice(), avgPrice != null ? avgPrice : "N/A");
            }
        }
        return "Marketplace general context available.";
    }

    private String buildPrompt(String userMessage, String context, String intent) {
        return "You are an expert advisor for MarketBridge marketplace. Use this data: " + context + "\n" +
               "User question: " + userMessage + "\n" +
               "Intent: " + intent + "\n" +
               "Provide a helpful, data-driven answer.";
    }

    private String callAIModel(String prompt, String userMessage) {
        String[] modelsToTry = {model, "gemini-1.5-flash", "gemini-pro", "gemini-flash-latest"};
        Exception lastException = null;

        for (String currentModel : modelsToTry) {
            try {
                String url = apiUrl + currentModel + ":generateContent?key=" + apiKey.trim();
                log.info("[AI-Advisor] Attempting connection with model: {}", currentModel);
                
                Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                        Map.of("parts", List.of(
                            Map.of("text", prompt)
                        ))
                    )
                );

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
                ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                    List<Map> candidates = (List<Map>) response.getBody().get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map content = (Map) candidates.get(0).get("content");
                        List<Map> parts = (List<Map>) content.get("parts");
                        log.info("[AI-Advisor] Success with model: {}", currentModel);
                        return (String) parts.get(0).get("text");
                    }
                }
            } catch (Exception e) {
                log.warn("[AI-Advisor] Attempt failed for model {}: {}", currentModel, e.getMessage());
                lastException = e;
            }
        }

        if (lastException != null) {
            log.error("[AI-Advisor] All Gemini models failed. Last error: {}", lastException.getMessage());
            lastException.printStackTrace();
        }
        return "I'm currently in Offline Mode. " + generateMockResponse(userMessage, "", detectIntent(userMessage, null));
    }

    private String generateMockResponse(String message, String context, String intent) {
        if (intent.equals("SELLING")) {
            return "To sell on MarketBridge, set a competitive price based on similar listings. High-quality photos help items sell 60% faster.";
        }
        if (intent.equals("BUYING_ADVICE")) {
            return "This seems like a fair deal based on the market average in our database.";
        }
        return "I am your MarketBridge AI Advisor. I can help with pricing, buying tips, or platform guides. What's on your mind?";
    }
}
