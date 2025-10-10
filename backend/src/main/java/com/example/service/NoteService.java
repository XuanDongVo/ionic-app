package com.example.service;

import com.example.dto.request.NoteRequest;
import com.example.dto.request.UpdateNoteRequest;
import com.example.dto.response.NoteResponse;
import com.example.dto.response.ReminderResponse;
import com.example.dto.response.TagResponse;
import com.example.entity.*;
import com.example.exception.BadRequestException;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    // Giả định có các service khác để lấy User, Notebook, Tag
    // private final UserService userService;
    // private final NotebookService notebookService;
    // private final TagService tagService;

    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotesByUser(Long userId) {
        List<Note> notes = noteRepository.findByUserId(userId);
        return notes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc bạn không có quyền truy cập"));
        return convertToResponse(note);
    }

    @Transactional
    public NoteResponse createNote(NoteRequest request, Long userId) {
        // Validation
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Title không được để trống");
        }

        Note note = new Note();
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setColor(request.getColor());
        note.setPinned(request.getIsPinned() != null ? request.getIsPinned() : false);
        note.setArchived(request.getIsArchived() != null ? request.getIsArchived() : false);

        // Set User - Trong thực tế cần userService.findById(userId)
        User user = new User();
        user.setId(userId);
        note.setUser(user);

        // Set Notebook nếu có
        if (request.getNotebookId() != null) {
            // Trong thực tế: notebookService.findByIdAndUserId(request.getNotebookId(), userId)
            Notebook notebook = new Notebook();
            notebook.setId(request.getNotebookId());
            note.setNotebook(notebook);
        }

        // Set Parent Note nếu có
        if (request.getParentNoteId() != null) {
            Note parentNote = noteRepository.findByIdAndUserId(request.getParentNoteId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent note không tồn tại"));
            note.setParentNote(parentNote);
        }

        // Set Tags nếu có
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (Long tagId : request.getTagIds()) {
                // Trong thực tế: tagService.findByIdAndUserId(tagId, userId)
                Tag tag = new Tag();
                tag.setId(tagId);
                tags.add(tag);
            }
            note.setTags(tags);
        }

        Note savedNote = noteRepository.save(note);
        return convertToResponse(savedNote);
    }

    @Transactional
    public NoteResponse updateNote(Long noteId, UpdateNoteRequest request, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc bạn không có quyền truy cập"));

        // Update các trường nếu có trong request
        if (request.getTitle() != null) {
            if (request.getTitle().trim().isEmpty()) {
                throw new BadRequestException("Title không được để trống");
            }
            note.setTitle(request.getTitle());
        }

        if (request.getContent() != null) {
            note.setContent(request.getContent());
        }

        if (request.getColor() != null) {
            note.setColor(request.getColor());
        }

        if (request.getIsPinned() != null) {
            note.setPinned(request.getIsPinned());
        }

        if (request.getIsArchived() != null) {
            note.setArchived(request.getIsArchived());
        }

        if (request.getNotebookId() != null) {
            // Trong thực tế: notebookService.findByIdAndUserId(request.getNotebookId(), userId)
            Notebook notebook = new Notebook();
            notebook.setId(request.getNotebookId());
            note.setNotebook(notebook);
        }

        if (request.getParentNoteId() != null) {
            if (request.getParentNoteId().equals(noteId)) {
                throw new BadRequestException("Note không thể là parent của chính nó");
            }
            Note parentNote = noteRepository.findByIdAndUserId(request.getParentNoteId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent note không tồn tại"));
            note.setParentNote(parentNote);
        }

        if (request.getTagIds() != null) {
            Set<Tag> tags = new HashSet<>();
            for (Long tagId : request.getTagIds()) {
                Tag tag = new Tag();
                tag.setId(tagId);
                tags.add(tag);
            }
            note.setTags(tags);
        }

        Note updatedNote = noteRepository.save(note);
        return convertToResponse(updatedNote);
    }

    @Transactional
    public void deleteNote(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc bạn không có quyền truy cập"));
        noteRepository.delete(note); // Soft delete nhờ @SQLDelete
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getPinnedNotes(Long userId) {
        List<Note> notes = noteRepository.findByUserIdAndIsPinnedTrue(userId);
        return notes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getArchivedNotes(Long userId) {
        List<Note> notes = noteRepository.findByUserIdAndIsArchivedTrue(userId);
        return notes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesByNotebook(Long notebookId, Long userId) {
        List<Note> notes = noteRepository.findByNotebookIdAndUserId(notebookId, userId);
        return notes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesByTag(Long tagId, Long userId) {
        List<Note> notes = noteRepository.findByTagIdAndUserId(tagId, userId);
        return notes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> searchNotes(String keyword, Long userId) {
        List<Note> notes = noteRepository.searchNotes(userId, keyword);
        return notes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getSubNotes(Long parentNoteId, Long userId) {
        // Kiểm tra parent note có tồn tại không
        noteRepository.findByIdAndUserId(parentNoteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent note không tồn tại"));

        List<Note> subNotes = noteRepository.findByParentNoteIdAndUserId(parentNoteId, userId);
        return subNotes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public NoteResponse togglePin(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc bạn không có quyền truy cập"));
        note.setPinned(!note.isPinned());
        Note updatedNote = noteRepository.save(note);
        return convertToResponse(updatedNote);
    }

    @Transactional
    public NoteResponse toggleArchive(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc bạn không có quyền truy cập"));
        note.setArchived(!note.isArchived());
        Note updatedNote = noteRepository.save(note);
        return convertToResponse(updatedNote);
    }

    // Helper method để convert Entity sang Response DTO
    private NoteResponse convertToResponse(Note note) {
        NoteResponse response = NoteResponse.builder()
                .id(note.getId())
                .title(note.getTitle())
                .content(note.getContent())
                .color(note.getColor())
                .isPinned(note.isPinned())
                .isArchived(note.isArchived())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();

        // Set User info
        if (note.getUser() != null) {
            response.setUserId(note.getUser().getId());
            response.setUsername(note.getUser().getUsername());
        }

        // Set Notebook info
        if (note.getNotebook() != null) {
            response.setNotebookId(note.getNotebook().getId());
            response.setNotebookName(note.getNotebook().getName());
        }

        // Set Parent Note info
        if (note.getParentNote() != null) {
            response.setParentNoteId(note.getParentNote().getId());
        }

        // Set Tags
        if (note.getTags() != null && !note.getTags().isEmpty()) {
            Set<TagResponse> tagResponses = note.getTags().stream()
                    .map(tag -> TagResponse.builder()
                            .id(tag.getId())
                            .name(tag.getName())
                            .color(tag.getColor())
                            .build())
                    .collect(Collectors.toSet());
            response.setTags(tagResponses);
        }

        // Set SubNotes count
        if (note.getSubNotes() != null) {
            response.setSubNotesCount(note.getSubNotes().size());
        }

        // Set Attachments count
        if (note.getAttachments() != null) {
            response.setAttachmentsCount(note.getAttachments().size());
        }

        // Set Reminder
        if (note.getReminder() != null) {
            ReminderResponse reminderResponse = ReminderResponse.builder()
                    .id(note.getReminder().getId())
                    .reminderTime(note.getReminder().getReminderTime())
                    .repeatType(note.getReminder().getRepeatType())
                    .isCompleted(note.getReminder().isCompleted())
                    .build();
            response.setReminder(reminderResponse);
        }

        return response;
    }
}

