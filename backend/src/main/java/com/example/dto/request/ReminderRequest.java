package com.example.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReminderRequest {
    @NotNull(message = "Note ID không được để trống")
    private Long noteId;

    @NotNull(message = "Thời gian nhắc không được để trống")
    private LocalDateTime reminderTime;

    private String repeatType; // DAILY, WEEKLY, etc.
}
