package com.example.controller;

import com.example.dto.request.EmailRequest;
import com.example.dto.request.ResetPasswordRequest;
import com.example.dto.request.VerifyPasswordRequest;
import com.example.dto.response.ApiResponse;
import com.example.service.ForgotPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    /**
     * Bước 1: Người dùng gửi email để nhận mã OTP
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> sendOtp(@RequestBody EmailRequest request) {
        try {
            String message = forgotPasswordService.sendOtpToEmail(request.getEmail());
            return ResponseEntity.ok(ApiResponse.success(message, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Gửi mã OTP thất bại: " + e.getMessage()));
        }
    }

    /**
     * Bước 2: Người dùng xác nhận OTP và đặt lại mật khẩu mới
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            String message = forgotPasswordService.resetPassword(
                    request.getEmail(),
                    request.getNewPassword(),
                    request.getNewPasswordConfirm()
            );
            return ResponseEntity.ok(ApiResponse.success(message, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đặt lại mật khẩu thất bại: " + e.getMessage()));
        }
    }

    /**
     * Bước 3: Gửi lại mã OTP (resend)
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<String>> resendOtp(@RequestBody EmailRequest request) {
        try {
            String message = forgotPasswordService.resendOtpToEmail(request.getEmail());
            return ResponseEntity.ok(ApiResponse.success(message, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Gửi lại mã OTP thất bại: " + e.getMessage()));
        }
    }

    /**
     * Bước 2: Xác thực mã OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@RequestBody VerifyPasswordRequest request) {
        try {
            String message = forgotPasswordService.verifyOtp(request.getEmail(), request.getOtp());
            return ResponseEntity.ok(ApiResponse.success(message, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Xác thực OTP thất bại: " + e.getMessage()));
        }
    }

}
