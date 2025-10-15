package com.example.controller;

import com.example.dto.response.ApiResponse;
import com.example.entity.User;
import com.example.repository.UserRepository;
import com.example.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // Helper method để lấy userId từ JWT token
    private Long getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        return null;
    }

    // Lấy thông tin profile của user hiện tại từ JWT
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUserProfile(HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized - Invalid token"));
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found"));
        }

        User user = userOpt.get();
        Map<String, Object> profileData = new HashMap<>();
        profileData.put("id", user.getId());
        profileData.put("username", user.getUsername());
        profileData.put("email", user.getEmail());
        profileData.put("profileImage", user.getProfileImage());
        profileData.put("createdAt", user.getCreatedAt());
        profileData.put("updatedAt", user.getUpdatedAt());

        return ResponseEntity.ok(ApiResponse.success("Get profile successfully", profileData));
    }

    //Cập nhật profile của user hiện tại từ JWT
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateCurrentUserProfile(
            HttpServletRequest request,
            @RequestBody Map<String, String> payload) {
        
        Long userId = getUserIdFromToken(request);
        
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized - Invalid token"));
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found"));
        }

        User user = userOpt.get();
        
        // Cập nhật username nếu có
        String username = payload.get("username");
        if (username != null && !username.trim().isEmpty()) {
            // Kiểm tra username đã tồn tại chưa (trừ user hiện tại)
            Optional<User> existingUser = userRepository.findByUsername(username);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Username already exists"));
            }
            user.setUsername(username);
        }

        // Cập nhật email nếu có
        String email = payload.get("email");
        if (email != null && !email.trim().isEmpty()) {
            // Kiểm tra email đã tồn tại chưa (trừ user hiện tại)
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Email already exists"));
            }
            user.setEmail(email);
        }

        userRepository.save(user);

        Map<String, Object> profileData = new HashMap<>();
        profileData.put("id", user.getId());
        profileData.put("username", user.getUsername());
        profileData.put("email", user.getEmail());
        profileData.put("profileImage", user.getProfileImage());

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profileData));
    }

    //Upload ảnh đại diện cho user hiện tại từ JWT
    @PostMapping("/me/image")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadCurrentUserImage(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file) {
        
        try {
            Long userId = getUserIdFromToken(request);
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Unauthorized - Invalid token"));
            }

            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("No file uploaded"));
            }

            // Kiểm tra loại file
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Only image files are allowed"));
            }

            // Kiểm tra kích thước file (10MB)
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("File size must be less than 10MB"));
            }

            // Tạo thư mục nếu chưa có
            Path uploadDir = Paths.get("uploads/profile");
            Files.createDirectories(uploadDir);

            // Tạo tên file unique và an toàn
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                originalFilename = "avatar.jpg";
            }
            
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFilename.substring(dotIndex);
            }
            
            String filename = System.currentTimeMillis() + "_" + userId + fileExtension;
            Path targetPath = uploadDir.resolve(filename);
            
            // Xóa file cũ nếu có
            User user = userOpt.get();
            if (user.getProfileImage() != null) {
                try {
                    String oldImagePath = user.getProfileImage().replace("/uploads/profile/", "");
                    Path oldFile = uploadDir.resolve(oldImagePath);
                    Files.deleteIfExists(oldFile);
                } catch (Exception e) {
                    // Ignore errors when deleting old file
                }
            }
            
            // Lưu file mới
            Files.copy(file.getInputStream(), targetPath);

            // Cập nhật user
            String imageUrl = "/uploads/profile/" + filename;
            user.setProfileImage(imageUrl);
            userRepository.save(user);

            Map<String, Object> result = new HashMap<>();
            result.put("profileImage", imageUrl);

            return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", result));
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred: " + e.getMessage()));
        }
    }

    //Đổi mật khẩu cho user hiện tại
    @PutMapping("/me/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            HttpServletRequest request,
            @RequestBody Map<String, String> payload) {
        
        Long userId = getUserIdFromToken(request);
        
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized - Invalid token"));
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found"));
        }

        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");
        String confirmPassword = payload.get("confirmPassword");

        if (currentPassword == null || newPassword == null || confirmPassword == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Missing required fields"));
        }

        User user = userOpt.get();

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Current password is incorrect"));
        }

        // Kiểm tra mật khẩu mới khớp nhau
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("New passwords do not match"));
        }

        // Kiểm tra độ dài mật khẩu mới
        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Password must be at least 6 characters"));
        }

        // Cập nhật mật khẩu
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
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

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam String email,
                                         @RequestParam("file") MultipartFile file) throws IOException {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        }
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Không có tập tin nào được tải lên");
        }

        Path uploadDir = Paths.get("uploads/profile");
        Files.createDirectories(uploadDir);
        String filename = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path target = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), target);

        User user = userOpt.get();
//        user.setImagePath("/uploads/profile/" + filename);
        userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
//        res.put("imagePath", user.getImagePath());
        return ResponseEntity.ok(res);
    }
}


