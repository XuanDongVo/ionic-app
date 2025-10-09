package com.example.service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class EncryptPassService {
    public String encryptPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        byte[] hashBytes = md.digest(password.getBytes());

        StringBuilder result = new StringBuilder();
        for (byte b : hashBytes) {
            result.append(String.format("%02x", b));
        }

        return result.toString();
    }
}
