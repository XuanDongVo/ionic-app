package com.example.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TagRequest {

    @NotBlank(message = "Tên tag không được để trống")
    @Size(max = 50, message = "Tên tag không vượt quá 50 ký tự")
    private String name;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Color phải là mã hex hợp lệ (vd: #FFFFFF)")
    private String color;
}

