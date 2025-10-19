package com.example.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReminderResponse {
    private Long id;
    private LocalDateTime reminderTime;
    private String repeatType;
    private boolean isCompleted;
    private boolean isActive;
    private LocalDateTime createdAt;
    private Long noteId;
    private String noteTitle;
}
