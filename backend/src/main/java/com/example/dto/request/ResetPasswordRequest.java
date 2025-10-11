package com.example.dto.request;

public class ResetPasswordRequest {
    private String email;
    private String newPassword;
    private String newPasswordConfirm;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }

    public String getNewPasswordConfirm() { return newPasswordConfirm; }
    public void setNewPasswordConfirm(String confirmPassword) { this.newPasswordConfirm = confirmPassword; }
}
