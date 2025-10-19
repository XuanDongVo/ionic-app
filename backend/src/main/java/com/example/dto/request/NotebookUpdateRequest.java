package com.example.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NotebookUpdateRequest {

    @NotBlank(message = "Tên notebook không được để trống")
    @Size(max = 100, message = "Tên notebook không vượt quá 100 ký tự")
    private String name;
}
