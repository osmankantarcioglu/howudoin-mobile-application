package com.howudoin.controller;

import com.howudoin.dto.MessageRequest;
import com.howudoin.model.Message;
import com.howudoin.service.MessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessagingController {

    @Autowired
    private MessagingService messagingService;

    // Send a message
    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageRequest request) {
        Message sentMessage = messagingService.sendMessage(request);
        return ResponseEntity.ok(sentMessage);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getConversation(@RequestParam String senderEmail, @RequestParam String receiverEmail) {
        List<Message> conversation = messagingService.getConversation(senderEmail, receiverEmail);
        return ResponseEntity.ok(conversation);
    }

}
