package com.example.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data //getter, setter, toString, equals, hashCode.
@NoArgsConstructor //tạo constructor rỗng
@AllArgsConstructor // tạo constructor có đầy đủ tham số
public class RegisterRequest {

    private String username;

    private String email;

    private String password;
}

