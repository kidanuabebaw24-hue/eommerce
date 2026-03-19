package com.marketplace.service;

import com.marketplace.dto.AIChatRequest;
import com.marketplace.dto.AIChatResponse;
import com.marketplace.entity.Product;
import com.marketplace.repository.ProductRepository;
import com.marketplace.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.ai.api-key:PLACEHOLDER_KEY}")
    private String apiKey;

    @Value("${app.ai.model:gpt-3.5-turbo}")
    private String model;

    public AIChatResponse processChatMessage(AIChatRequest request) {
        String userMessage = request.getMessage().toLowerCase();
        Long productId = request.getProductId();

        String context = "";
        String intent = detectIntent(userMessage, productId);

        if (productId != null) {
            context = gatherProductContext(productId);
        } else if (intent.equals("SELLING")) {
            context = gatherMarketContext();
        }

        String prompt = buildPrompt(userMessage, context, intent);
        
        // In a real implementation, we would call an external AI API here.
        // For this demonstration, we'll return a smart structured response if no API key is set.
        String aiResponse;
        if (apiKey.equals("PLACEHOLDER_KEY")) {
            aiResponse = generateMockResponse(userMessage, context, intent);
        } else {
            aiResponse = callAIModel(prompt);
        }

        return AIChatResponse.builder()
                .response(aiResponse)
                .status("SUCCESS")
                .build();
    }

    private String detectIntent(String message, Long productId) {
        String msg = message.toLowerCase();
        if (msg.contains("compare") || msg.contains("better") || msg.contains("alternative") || msg.contains("difference")) {
            return "COMPARISON";
        }
        if (msg.contains("sell") || msg.contains("list") || msg.contains("post my") || msg.contains("valuation")) {
            return "SELLING";
        }
        if (msg.contains("price") || msg.contains("worth") || msg.contains("cost") || msg.contains("expensive") || msg.contains("cheap") || msg.contains("reasonable")) {
            return productId != null ? "BUYING_ADVICE" : "MARKET_INFO";
        }
        if (msg.contains("how") || msg.contains("payment") || msg.contains("chapa") || msg.contains("delivery") || msg.contains("trust") || msg.contains("verify") || msg.contains("account")) {
            return "GENERAL_PLATFORM";
        }
        return "GENERAL_CONVERSATION";
    }

    private String gatherProductContext(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return "Product not found.";

        BigDecimal avgPrice = productRepository.findAveragePriceByCategory(product.getCategory().getId());
        List<Product> similar = productRepository.findSimilarProducts(
                product.getCategory().getId(),
                product.getId(),
                product.getPrice().multiply(new BigDecimal("0.8")),
                product.getPrice().multiply(new BigDecimal("1.2")),
                product.getPrice(),
                PageRequest.of(0, 3)
        );

        StringBuilder sb = new StringBuilder();
        sb.append("Current Product: ").append(product.getTitle()).append(" (Price: ").append(product.getPrice()).append(" ETB)\n");
        sb.append("Category Average Price: ").append(avgPrice != null ? avgPrice : "N/A").append(" ETB\n");
        sb.append("Similar Listings:\n");
        for (Product p : similar) {
            sb.append("- ").append(p.getTitle()).append(": ").append(p.getPrice()).append(" ETB\n");
        }
        return sb.toString();
    }

    private String gatherMarketContext() {
        // General market stats could be added here
        return "General marketplace data is available for analysis.";
    }

    private String buildPrompt(String userMessage, String context, String intent) {
        return "You are a helpful AI advisor for the MarketBridge marketplace. " +
                "Use the following database context to answer the user's question.\n\n" +
                "Context:\n" + context + "\n\n" +
                "User Intent: " + intent + "\n" +
                "User Question: " + userMessage + "\n\n" +
                "Provide a professional, data-driven response.";
    }

    private String callAIModel(String prompt) {
        // Simplified OpenAI/Gemini call structure
        log.info("Calling AI model with prompt: {}", prompt);
        return "This is a response from the AI model based on your data.";
    }

    private String generateMockResponse(String message, String context, String intent) {
        String msg = message.toLowerCase();
        
        if (intent.equals("BUYING_ADVICE") && context.contains("Current Product")) {
            // Extract prices from context for dynamic response
            String currentPriceRange = "this price";
            if (context.contains("Current Product:")) {
                String line = context.split("\n")[0];
                currentPriceRange = line.substring(line.indexOf("Price: ") + 7);
            }
            
            if (msg.contains("reasonable") || msg.contains("good") || msg.contains("worth")) {
                return "Based on my analysis of similar listings, " + currentPriceRange + " is quite competitive. " +
                        "The marketplace data shows others in this category are priced around the same range, so this looks like a fair deal.";
            }
            if (msg.contains("expensive") || msg.contains("cheap")) {
                return "Compared to the category average in our database, " + currentPriceRange + " is positioned " + 
                        (msg.contains("cheap") ? "attractively." : "at a premium level.") + 
                        " I recommend verifying the product condition and seller history to justify the valuation.";
            }
            return "I've analyzed the marketplace data for this item. " + context.replace("\n", " ") + 
                    ". Overall, it seems like a solid option within its category.";
        }

        if (intent.equals("SELLING")) {
            return "For sellers on MarketBridge, data-driven pricing is key. Currently, " + 
                    (context.contains("ETB") ? "category data suggests " + context.split("\n")[1] : "items in this category sell best when priced near the market average.") + 
                    "\n\nPro-tip: Listings with high-quality photos and verified seller status get 60% more inquiries.";
        }

        if (intent.equals("GENERAL_PLATFORM")) {
            if (msg.contains("post") || msg.contains("list") || msg.contains("sell")) 
                return "To post a product, go to your Dashboard and click 'Create Product'. You'll need high-quality photos and a clear title. Once published, your item will be visible to thousands of buyers.";
            if (msg.contains("payment") || msg.contains("chapa") || msg.contains("money")) 
                return "We use the Chapa payment gateway for 100% secure transactions. Funds are held in escrow until the buyer confirms the receipt of the item, protecting both parties.";
            if (msg.contains("verify") || msg.contains("trust") || msg.contains("account")) 
                return "Trust is our priority. Get a 'Verified' badge by completing your profile and uploading identity proof in the settings. This increases your chances of successful trades.";
        }

        if (intent.equals("COMPARISON")) {
            return "Analyzing alternatives... " + (context.contains("Similar Listings") ? "I've found 3 similar items that might offer better value. Look for the 'Similar' section on the page for details." : "I recommend browsing similar categories to find the best value for your money.");
        }

        return "I am your MarketBridge AI Advisor. I noticed you're asking about " + intent.toLowerCase().replace("_", " ") + ". " +
                "I can help with price estimation, buying tips, or platform guides. What's on your mind?";
    }
}
