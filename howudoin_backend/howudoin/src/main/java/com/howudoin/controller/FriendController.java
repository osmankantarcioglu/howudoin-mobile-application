package com.howudoin.controller;

import com.howudoin.dto.FriendRequestPayload;
import com.howudoin.model.User;
import com.howudoin.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    // Send a friend request
    @PostMapping("/add")
    public ResponseEntity<String> sendFriendRequest(@RequestBody FriendRequestPayload payload) {
        // Extract emails from the payload
        String fromEmail = payload.getFromEmail();
        String toEmail = payload.getToEmail();

        // Validate inputs
        if (fromEmail == null || fromEmail.isEmpty() || toEmail == null || toEmail.isEmpty()) {
            throw new IllegalArgumentException("Both fromEmail and toEmail must be provided and non-empty.");
        }

        // Call the service to handle the friend request using emails
        friendService.sendFriendRequestByEmail(fromEmail, toEmail);

        // Return success response
        return ResponseEntity.ok("Friend request sent successfully.");
    }

    @PostMapping("/accept")
    public ResponseEntity<String> acceptFriendRequest(@RequestBody FriendRequestPayload payload) {
        // Extract emails from the payload
        String fromEmail = payload.getFromEmail();
        String toEmail = payload.getToEmail();

        // Validate inputs
        if (fromEmail == null || fromEmail.isEmpty() || toEmail == null || toEmail.isEmpty()) {
            throw new IllegalArgumentException("Both fromEmail and toEmail must be provided and non-empty.");
        }

        // Call the service to handle accepting the friend request
        friendService.acceptFriendRequest(fromEmail, toEmail);

        // Return success response
        return ResponseEntity.ok("Friend request accepted successfully.");
    }


    // Fetch the list of friends
    // Fetch the list of friends by email
    // Fetch the list of friends by email
    @GetMapping
    public ResponseEntity<List<User>> getFriends(@RequestParam String email) {
        // Validate the input
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email must be provided and non-empty.");
        }

        // Retrieve the friend list by email
        List<User> friends = friendService.getFriendsByEmail(email);

        // Return the list of friends
        return ResponseEntity.ok(friends);
    }




}

