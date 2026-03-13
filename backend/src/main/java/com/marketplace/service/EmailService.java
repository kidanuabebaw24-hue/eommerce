package com.marketplace.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@marketbridge.com}")
    private String fromEmail;

    public void sendContactSellerEmail(String recipientEmail, String recipientName, 
                                      String senderName, String senderEmail, 
                                      String productTitle, String messageContent) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("New Inquiry About Your Product: " + productTitle);
            
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "You have received a new inquiry about your product '%s' on MarketBridge.\n\n" +
                "From: %s (%s)\n\n" +
                "Message:\n%s\n\n" +
                "---\n" +
                "Reply directly to this email to respond to the buyer.\n\n" +
                "Best regards,\n" +
                "MarketBridge Team",
                recipientName, productTitle, senderName, senderEmail, messageContent
            );
            
            message.setText(emailBody);
            message.setReplyTo(senderEmail);
            
            mailSender.send(message);
            log.info("Email sent successfully to {} about product: {}", recipientEmail, productTitle);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", recipientEmail, e.getMessage());
            // Don't throw exception - we still want to save the message even if email fails
        }
    }

    public void sendMessageNotification(String recipientEmail, String recipientName, int unreadCount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("You have " + unreadCount + " new message(s) on MarketBridge");
            
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "You have %d unread message(s) waiting for you on MarketBridge.\n\n" +
                "Log in to your account to view and respond to your messages.\n\n" +
                "Best regards,\n" +
                "MarketBridge Team",
                recipientName, unreadCount
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            log.info("Notification email sent to {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send notification email: {}", e.getMessage());
        }
    }
}
