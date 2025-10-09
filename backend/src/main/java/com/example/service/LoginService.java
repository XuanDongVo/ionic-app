package com.example.service;

import com.example.dto.LoginDTO;
import com.example.jwt.JwtTokenProvider;
import com.example.model.User;
import com.example.repository.UserRepository;
import com.example.response.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.NoSuchAlgorithmException;

@Service
public class LoginService {
    @Autowired
    private UserRepository userRepository;

    private EncryptPassService encryptPassService = new EncryptPassService();

    private JwtTokenProvider jwtTokenProvider = new JwtTokenProvider();

    public LoginResponse login(LoginDTO request) throws NoSuchAlgorithmException {
        String email = request.getEmail();
        String password = request.getPassword();

        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email or password cannot be empty");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String encryptedInputPassword = encryptPassService.encryptPassword(password);

        if (!encryptedInputPassword.equals(user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return new LoginResponse(
                user.getId(),
                token
        );
    }
}
