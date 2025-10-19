package com.example.controller;

import com.example.dto.request.NoteRequest;
import com.example.dto.request.UpdateNoteRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.NoteResponse;
import com.example.service.NoteService;
import com.example.util.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getAllNotes() {
        Long userId = AuthUtils.getCurrentUserId();
        List<NoteResponse> notes = noteService.getAllNotesByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes thành công", notes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> getNoteById(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        NoteResponse note = noteService.getNoteById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin note thành công", note));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NoteResponse>> createNote(@Valid @RequestBody NoteRequest request) {
        Long userId = AuthUtils.getCurrentUserId();
        NoteResponse note = noteService.createNote(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo note thành công", note));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> updateNote(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNoteRequest request
    ) {
        Long userId = AuthUtils.getCurrentUserId();
        NoteResponse note = noteService.updateNote(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật note thành công", note));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        noteService.deleteNote(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Xóa note thành công", null));
    }

    @GetMapping("/pinned")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getPinnedNotes() {
        Long userId = AuthUtils.getCurrentUserId();
        List<NoteResponse> notes = noteService.getPinnedNotes(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes đã pin thành công", notes));
    }

    @GetMapping("/archived")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getArchivedNotes() {
        Long userId = AuthUtils.getCurrentUserId();
        List<NoteResponse> notes = noteService.getArchivedNotes(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes đã lưu trữ thành công", notes));
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getCompletedNotes() {
        Long userId = AuthUtils.getCurrentUserId();
        List<NoteResponse> notes = noteService.getCompletedNotes(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes đã hoàn thành thành công", notes));
    }

    @GetMapping("/notebook/{notebookId}")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getNotesByNotebook(@PathVariable Long notebookId) {
        Long userId = AuthUtils.getCurrentUserId();
        List<NoteResponse> notes = noteService.getNotesByNotebook(notebookId, userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes theo notebook thành công", notes));
    }

    @GetMapping("/tag/{tagId}")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getNotesByTag(@PathVariable Long tagId) {
        Long userId = AuthUtils.getCurrentUserId();
        List<NoteResponse> notes = noteService.getNotesByTag(tagId, userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes theo tag thành công", notes));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> searchNotes(@RequestParam String keyword) {
        Long userId = AuthUtils.getCurrentUserId();
        List<NoteResponse> notes = noteService.searchNotes(keyword, userId);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm notes thành công", notes));
    }

    @GetMapping("/{id}/sub-notes")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getSubNotes(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        List<NoteResponse> subNotes = noteService.getSubNotes(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sub-notes thành công", subNotes));
    }

    @PatchMapping("/{id}/toggle-pin")
    public ResponseEntity<ApiResponse<NoteResponse>> togglePin(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        NoteResponse note = noteService.togglePin(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Toggle pin thành công", note));
    }

    @PatchMapping("/{id}/toggle-archive")
    public ResponseEntity<ApiResponse<NoteResponse>> toggleArchive(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        NoteResponse note = noteService.toggleArchive(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Toggle archive thành công", note));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<NoteResponse>> updateNoteStatus(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        NoteResponse updatedNote = noteService.updateStatus(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái note thành công", updatedNote));
    }
}
