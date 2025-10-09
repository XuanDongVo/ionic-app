package com.example.response;

import com.example.model.User;

public class LoginResponse {
    private String userId;
    private String token;

    public LoginResponse(String userId, String token) {
        this.userId = userId;
        this.token = token;
    }
}
