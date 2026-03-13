package com.marketplace.repository;

import com.marketplace.entity.Message;
import com.marketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientOrderByCreatedAtDesc(User recipient);
    List<Message> findByRecipientAndIsReadOrderByCreatedAtDesc(User recipient, Boolean isRead);
    Long countByRecipientAndIsRead(User recipient, Boolean isRead);
    Long countByIsRead(Boolean isRead);
    Long countByCreatedAtAfter(java.time.LocalDateTime date);
}
