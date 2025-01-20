package com.howudoin.dto;

public class MessageRequest {
    private String senderEmail;
    private String receiverEmail;
    private String content;

    // Default constructor
    public MessageRequest() {
    }

    // Parameterized constructor
    public MessageRequest(String senderEmail, String receiverEmail, String content) {
        this.senderEmail = senderEmail;
        this.receiverEmail = receiverEmail;
        this.content = content;
    }

    // Getter and Setter for 'senderEmail'
    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    // Getter and Setter for 'receiverEmail'
    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    // Getter and Setter for 'content'
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
