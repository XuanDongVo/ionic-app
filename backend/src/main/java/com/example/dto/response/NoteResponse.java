package com.example.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteResponse {
    private Long id;
    private String title;
    private String content;
    private String color;
    private boolean isPinned;
    private boolean isArchived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private String username;
    private Long notebookId;
    private String notebookName;
    private Long parentNoteId;
    private List<TagResponse> tags;
    private int subNotesCount;
    private int attachmentsCount;
    private ReminderResponse reminder;
    private boolean isCompleted;
    private List<Long> tagIds;

}

