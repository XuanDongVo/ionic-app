package com.example.service;

import com.example.entity.User;
import com.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ForgotPasswordService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;

    public String sendOtpToEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return "Không tìm thấy tài khoản với email: " + email;
        }

        otpService.generateAndSendOtp(email);

        return "Mã OTP đã được gửi tới email " + email + ". Vui lòng kiểm tra hộp thư.";
    }


    @Transactional
    public String resetPassword(String email, String newPassword, String newPasswordConfirm) {

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "Không tìm thấy người dùng với email này!";
        }

        if (!newPassword.equals(newPasswordConfirm)) {
            return "Mật khẩu xác nhận không khớp!";
        }

        User user = userOpt.get();

        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.saveAndFlush(user);

        otpService.removeOtp(email);
        return "Đặt lại mật khẩu thành công cho tài khoản " + email;
    }


    public String resendOtpToEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return "Không tìm thấy tài khoản với email: " + email;
        }

        otpService.generateAndSendOtp(email); // Tạo mã mới và gửi lại

        return "Mã OTP mới đã được gửi lại tới email " + email + ". Vui lòng kiểm tra hộp thư.";
    }

    @Transactional(readOnly = true)
    public String verifyOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return "Không tìm thấy người dùng với email này!";
        }

        boolean isValidOtp = otpService.verifyOtp(email, otp);

        if (!isValidOtp) {
            return "Mã OTP không chính xác hoặc đã hết hạn!";
        }

        return "Xác thực OTP thành công!";
    }

}
