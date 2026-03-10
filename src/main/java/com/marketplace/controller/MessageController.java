package com.marketplace.controller;

import com.marketplace.dto.MessageRequest;
import com.marketplace.dto.MessageResponse;
import com.marketplace.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@Valid @RequestBody MessageRequest request) {
        return new ResponseEntity<>(messageService.sendMessage(request), HttpStatus.CREATED);
    }

    @GetMapping("/my-messages")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<List<MessageResponse>> getMyMessages() {
        return ResponseEntity.ok(messageService.getMyMessages());
    }

    @GetMapping("/unread")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<List<MessageResponse>> getUnreadMessages() {
        return ResponseEntity.ok(messageService.getUnreadMessages());
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(messageService.getUnreadCount());
    }

    @PutMapping("/{id}/mark-read")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        messageService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
