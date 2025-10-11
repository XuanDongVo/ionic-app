package com.example.controller;

import com.example.entity.User;
import com.example.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestParam(required = false) String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Bắt buộc phải có email");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        }
        User user = userOpt.get();
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getId());
        dto.put("fullName", user.getUsername());
        dto.put("email", user.getEmail());
        dto.put("imagePath", null);
        return ResponseEntity.ok(dto);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestParam String email,
                                           @RequestBody Map<String, String> payload) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        }
        User user = userOpt.get();
        String fullName = payload.get("fullName");
        String newEmail = payload.get("email");
        if (fullName != null) user.setUsername(fullName);
        if (newEmail != null) user.setEmail(newEmail);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

//    @PostMapping("/image")
//    public ResponseEntity<?> uploadImage(@RequestParam String email,
//                                         @RequestParam("file") MultipartFile file) throws IOException {
//        Optional<User> userOpt = userRepository.findByEmail(email);
//        if (userOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
//        }
//        if (file.isEmpty()) {
//            return ResponseEntity.badRequest().body("Không có tập tin nào được tải lên");
//        }
//
//        Path uploadDir = Paths.get("uploads/profile");
//        Files.createDirectories(uploadDir);
//        String filename = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
//        Path target = uploadDir.resolve(filename);
//        Files.copy(file.getInputStream(), target);
//
//        User user = userOpt.get();
//        user.setImagePath("/uploads/profile/" + filename);
//        userRepository.save(user);
//
//        Map<String, Object> res = new HashMap<>();
//        res.put("imagePath", user.getImagePath());
//        return ResponseEntity.ok(res);
//    }
}


