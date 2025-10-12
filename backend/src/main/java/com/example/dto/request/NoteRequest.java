package com.example.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteRequest {

    @NotBlank(message = "Title không được để trống")
    @Size(max = 255, message = "Title không được vượt quá 255 ký tự")
    private String title;

    private String content;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Color phải là mã hex hợp lệ (vd: #FFFFFF)")
    private String color;

    private Boolean isPinned;

    private Boolean isArchived;

    private Long notebookId;

    private Long parentNoteId;

    private Set<Long> tagIds;

    private Boolean isCompleted;

}

