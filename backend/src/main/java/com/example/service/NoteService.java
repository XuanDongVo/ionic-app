package com.example.service;

import com.example.dto.request.NoteRequest;
import com.example.dto.request.UpdateNoteRequest;
import com.example.dto.response.NoteResponse;
import com.example.entity.Note;
import com.example.entity.Notebook;
import com.example.entity.Tag;
import com.example.entity.User;
import com.example.exception.BadRequestException;
import com.example.exception.ResourceNotFoundException;
import com.example.mapper.NoteMapper;
import com.example.repository.NoteRepository;
import com.example.repository.NotebookRepository;
import com.example.repository.TagRepository;
import com.example.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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
    private final NotebookRepository notebookRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final NoteMapper noteMapper;
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotesByUser(Long userId) {
        List<Note> notes = noteRepository.findAllByUserId(userId);
        return noteMapper.toResponseList(notes);
    }

    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc bạn không có quyền truy cập"));
        return noteMapper.toResponse(note);
    }

    @Transactional
    public NoteResponse createNote(NoteRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        Note note = noteMapper.toEntity(request);
        note.setUser(user);

        if (request.getNotebookId() != null) {
            Notebook notebook = notebookRepository.findByIdAndUserId(request.getNotebookId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Notebook không tồn tại hoặc không thuộc về bạn"));
            note.setNotebook(notebook);
        }

        if (request.getParentNoteId() != null) {
            Note parentNote = noteRepository.findByIdAndUserId(request.getParentNoteId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent note không tồn tại hoặc không thuộc về bạn"));
            note.setParentNote(parentNote);
        }

        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllByIdInAndUserId(request.getTagIds(), userId);
            if (tags.size() != request.getTagIds().size()) {
                throw new BadRequestException("Một hoặc nhiều tag không tồn tại hoặc không thuộc về bạn");
            }
            note.setTags(new HashSet<>(tags));
        }

        Note saved = noteRepository.save(note);
        return noteMapper.toResponse(saved);
    }

    @Transactional
    public NoteResponse updateNote(Long noteId, UpdateNoteRequest request, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc bạn không có quyền truy cập"));

        // Sử dụng MapStruct để cập nhật các trường cơ bản từ request
        noteMapper.updateEntityFromRequest(request, note);

        // Xử lý các mối quan hệ một cách an toàn
        if (request.getNotebookId() != null) {
            Notebook notebook = notebookRepository.findByIdAndUserId(request.getNotebookId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Notebook không tồn tại hoặc không thuộc về bạn"));
            note.setNotebook(notebook);
        }

        if (request.getParentNoteId() != null) {
            if (request.getParentNoteId().equals(noteId)) {
                throw new BadRequestException("Note không thể là parent của chính nó");
            }
            Note parentNote = noteRepository.findByIdAndUserId(request.getParentNoteId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent note không tồn tại hoặc không thuộc về bạn"));
            note.setParentNote(parentNote);
        }

        if (request.getTagIds() != null) {
            if (request.getTagIds().isEmpty()) {
                note.getTags().clear();
            } else {
                List<Tag> tags = tagRepository.findAllByIdInAndUserId(request.getTagIds(), userId);
                if (tags.size() != request.getTagIds().size()) {
                    throw new BadRequestException("Một hoặc nhiều tag không tồn tại hoặc không thuộc về bạn");
                }
                note.setTags(new HashSet<>(tags));
            }
        }

        noteRepository.save(note);
        Note updatedNote = noteRepository.findByIdWithRelations(note.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không thể load note sau khi cập nhật"));

        return noteMapper.toResponse(updatedNote);
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
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getArchivedNotes(Long userId) {
        List<Note> notes = noteRepository.findByUserIdAndIsArchivedTrue(userId);
        return notes.stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getCompletedNotes(Long userId) {
        List<Note> notes = noteRepository.findByUserIdAndIsCompletedTrue(userId);
        // Sử dụng lại mapstruct mapper để chuyển đổi sang DTO
        return notes.stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesByNotebook(Long notebookId, Long userId) {
        List<Note> notes = noteRepository.findByNotebookIdAndUserId(notebookId, userId);
        return notes.stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesByTag(Long tagId, Long userId) {
        List<Note> notes = noteRepository.findByTagIdAndUserId(tagId, userId);
        return notes.stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> searchNotes(String keyword, Long userId) {
        List<Note> notes = noteRepository.searchNotes(userId, keyword);
        return notes.stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getSubNotes(Long parentNoteId, Long userId) {
        // Kiểm tra parent note có tồn tại không
        noteRepository.findByIdAndUserId(parentNoteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent note không tồn tại"));

        List<Note> subNotes = noteRepository.findByParentNoteIdAndUserId(parentNoteId, userId);
        return subNotes.stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public NoteResponse togglePin(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc bạn không có quyền truy cập"));
        note.setPinned(!note.isPinned());
        Note updatedNote = noteRepository.save(note);
        return noteMapper.toResponse(updatedNote);
    }

    @Transactional
    public NoteResponse toggleArchive(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc bạn không có quyền truy cập"));
        note.setArchived(!note.isArchived());
        Note updatedNote = noteRepository.save(note);
        return noteMapper.toResponse(updatedNote);
    }

    // update status
    @Transactional
    public NoteResponse updateStatus(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc bạn không có quyền truy cập"));

        note.setCompleted(!note.isCompleted());
        Note updatedNote = noteRepository.save(note);
        return noteMapper.toResponse(updatedNote);
    }

}
