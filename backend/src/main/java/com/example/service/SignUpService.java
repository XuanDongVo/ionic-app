package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;

import java.security.NoSuchAlgorithmException;

public class SignUpService {
    private UserRepository userRepository;
    private EncryptPassService encryptPassService;

    public String signUp(String email, String password) throws NoSuchAlgorithmException {
        String result = "";
        if(email.isEmpty() || password.isEmpty()){
            result = "Email or password is empty";
        }
        String pass_encrypt = encryptPassService.encryptPassword(password);
        User user = new User(email, pass_encrypt);
        userRepository.save(user);
        return result;
    }
}
