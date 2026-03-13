package com.marketplace.service;

import com.marketplace.dto.MessageRequest;
import com.marketplace.dto.MessageResponse;
import com.marketplace.entity.Message;
import com.marketplace.entity.Product;
import com.marketplace.entity.User;
import com.marketplace.repository.MessageRepository;
import com.marketplace.repository.ProductRepository;
import com.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public MessageResponse sendMessage(MessageRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User recipient = product.getOwner();

        Message message = Message.builder()
                .senderName(request.getSenderName())
                .senderEmail(request.getSenderEmail())
                .content(request.getContent())
                .product(product)
                .recipient(recipient)
                .isRead(false)
                .build();

        Message savedMessage = messageRepository.save(message);

        // Send email notification to seller
        emailService.sendContactSellerEmail(
                recipient.getEmail(),
                recipient.getFullname(),
                request.getSenderName(),
                request.getSenderEmail(),
                product.getTitle(),
                request.getContent()
        );

        return mapToResponse(savedMessage);
    }

    public List<MessageResponse> getMyMessages() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return messageRepository.findByRecipientOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MessageResponse> getUnreadMessages() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return messageRepository.findByRecipientAndIsReadOrderByCreatedAtDesc(currentUser, false)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!message.getRecipient().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized to mark this message as read");
        }

        message.setIsRead(true);
        messageRepository.save(message);
    }

    public Long getUnreadCount() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return messageRepository.countByRecipientAndIsRead(currentUser, false);
    }

    private MessageResponse mapToResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderName(message.getSenderName())
                .senderEmail(message.getSenderEmail())
                .content(message.getContent())
                .productId(message.getProduct().getId())
                .productTitle(message.getProduct().getTitle())
                .recipientUsername(message.getRecipient().getUsername())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .build();
    }

    /**
     * Get all messages (Admin only)
     */
    public List<MessageResponse> getAllMessages() {
        return messageRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get message statistics (Admin only)
     */
    public java.util.Map<String, Object> getMessageStats() {
        long totalMessages = messageRepository.count();
        long unreadMessages = messageRepository.countByIsRead(false);
        long readMessages = totalMessages - unreadMessages;

        // Get messages by date (last 7 days)
        java.time.LocalDateTime sevenDaysAgo = java.time.LocalDateTime.now().minusDays(7);
        long recentMessages = messageRepository.countByCreatedAtAfter(sevenDaysAgo);

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalMessages", totalMessages);
        stats.put("unreadMessages", unreadMessages);
        stats.put("readMessages", readMessages);
        stats.put("recentMessages", recentMessages);
        stats.put("readRate", totalMessages > 0 ? (readMessages * 100.0 / totalMessages) : 0);

        return stats;
    }

    /**
     * Delete message (Admin only)
     */
    @Transactional
    public void deleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        messageRepository.delete(message);
    }
}
