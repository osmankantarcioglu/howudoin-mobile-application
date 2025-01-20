package com.howudoin.repository;

import com.howudoin.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderEmailAndReceiverEmail(String senderEmail, String receiverEmail);
    List<Message> findByReceiverEmailAndSenderEmail(String receiverEmail, String senderEmail);
}
