package com.howudoin.controller;

import com.howudoin.dto.GroupAdd;
import com.howudoin.model.Group;
import com.howudoin.model.Message;
import com.howudoin.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/create")
    public ResponseEntity<Group> createGroup(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        List<String> members = (List<String>) request.get("members");
        Group group = groupService.createGroup(name, members);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/{groupId}/add-member")
    public ResponseEntity<String> addMember(
            @PathVariable String groupId,
            @RequestBody GroupAdd groupAdd) {

        groupService.addMemberToGroup(groupId, groupAdd.getUserEmail());
        return ResponseEntity.ok("Member added successfully.");
    }



    @PostMapping("/{groupId}/send")
    public ResponseEntity<Message> sendMessageToGroup(@PathVariable String groupId, @RequestBody Map<String, String> request) {
        String senderEmail = request.get("senderEmail");
        String content = request.get("content");
        Message message = groupService.sendMessageToGroup(groupId, senderEmail, content);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<Message>> getGroupMessages(@PathVariable String groupId) {
        // Use the service to fetch messages
        List<Message> messages = groupService.getGroupMessages(groupId);
        return ResponseEntity.ok(messages);
    }


    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<String>> getGroupMembers(@PathVariable String groupId) {
        List<String> members = groupService.getGroupMembers(groupId);
        return ResponseEntity.ok(members);
    }

    @GetMapping
    public ResponseEntity<List<Group>> getUserGroups(@RequestParam String email) {
        List<Group> allGroups = groupService.getAllGroupsForUser(email);
        return ResponseEntity.ok(allGroups);
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<Group> getGroupById(@PathVariable String groupId) {
        Group group = groupService.getGroupById(groupId);
        return ResponseEntity.ok(group);
    }

}