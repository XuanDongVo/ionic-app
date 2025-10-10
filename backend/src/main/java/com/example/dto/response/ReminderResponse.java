package com.example.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderResponse {
    private Long id;
    private LocalDateTime reminderTime;
    private String repeatType;
    private boolean isCompleted;
}
