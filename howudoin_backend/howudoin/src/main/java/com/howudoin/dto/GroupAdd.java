package com.howudoin.dto;

import lombok.Data;

@Data
public class GroupAdd {
    private String userEmail;

    public String getUserEmail() {
        return userEmail;
    }
}