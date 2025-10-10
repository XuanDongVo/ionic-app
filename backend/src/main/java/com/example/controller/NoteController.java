package com.example.controller;

import com.example.dto.request.NoteRequest;
import com.example.dto.request.UpdateNoteRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.NoteResponse;
import com.example.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NoteController {

    private final NoteService noteService;

    // Lấy tất cả notes của user
    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getAllNotes(
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        List<NoteResponse> notes = noteService.getAllNotesByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes thành công", notes));
    }

    // Lấy note theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> getNoteById(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        NoteResponse note = noteService.getNoteById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin note thành công", note));
    }

    // Tạo note mới
    @PostMapping
    public ResponseEntity<ApiResponse<NoteResponse>> createNote(
            @Valid @RequestBody NoteRequest request,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        NoteResponse note = noteService.createNote(request, userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo note thành công", note));
    }

    // Cập nhật note
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> updateNote(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNoteRequest request,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        NoteResponse note = noteService.updateNote(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật note thành công", note));
    }

    // Xóa note
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        noteService.deleteNote(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Xóa note thành công", null));
    }

    // Lấy notes đã pin
    @GetMapping("/pinned")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getPinnedNotes(
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        List<NoteResponse> notes = noteService.getPinnedNotes(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes đã pin thành công", notes));
    }

    // Lấy notes đã lưu trữ
    @GetMapping("/archived")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getArchivedNotes(
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        List<NoteResponse> notes = noteService.getArchivedNotes(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes đã lưu trữ thành công", notes));
    }

    // Lấy notes theo notebook
    @GetMapping("/notebook/{notebookId}")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getNotesByNotebook(
            @PathVariable Long notebookId,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        List<NoteResponse> notes = noteService.getNotesByNotebook(notebookId, userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes theo notebook thành công", notes));
    }

    // Lấy notes theo tag
    @GetMapping("/tag/{tagId}")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getNotesByTag(
            @PathVariable Long tagId,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        List<NoteResponse> notes = noteService.getNotesByTag(tagId, userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notes theo tag thành công", notes));
    }

    // Tìm kiếm notes
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> searchNotes(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        List<NoteResponse> notes = noteService.searchNotes(keyword, userId);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm notes thành công", notes));
    }

    // Lấy sub-notes của một note
    @GetMapping("/{id}/sub-notes")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getSubNotes(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        List<NoteResponse> subNotes = noteService.getSubNotes(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sub-notes thành công", subNotes));
    }

    // Toggle pin note
    @PatchMapping("/{id}/toggle-pin")
    public ResponseEntity<ApiResponse<NoteResponse>> togglePin(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        NoteResponse note = noteService.togglePin(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Toggle pin thành công", note));
    }

    // Toggle archive note
    @PatchMapping("/{id}/toggle-archive")
    public ResponseEntity<ApiResponse<NoteResponse>> toggleArchive(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        NoteResponse note = noteService.toggleArchive(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Toggle archive thành công", note));
    }
}
