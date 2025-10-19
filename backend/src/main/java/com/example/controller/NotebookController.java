package com.example.controller;

import com.example.dto.request.NotebookCreateRequest;
import com.example.dto.request.NotebookUpdateRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.NotebookResponse;
import com.example.service.NotebookService;
import com.example.util.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notebooks")
@RequiredArgsConstructor
public class NotebookController {

    private final NotebookService notebookService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotebookResponse>>> getAll() {
        Long userId = AuthUtils.getCurrentUserId();
        List<NotebookResponse> notebooks = notebookService.getAllByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notebook thành công", notebooks));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotebookResponse>> create(
            @Valid @RequestBody NotebookCreateRequest request) {
        Long userId = AuthUtils.getCurrentUserId();
        NotebookResponse notebook = notebookService.createNotebook(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo notebook thành công", notebook));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NotebookResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody NotebookUpdateRequest request) {
        Long userId = AuthUtils.getCurrentUserId();
        NotebookResponse notebook = notebookService.updateNotebook(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật notebook thành công", notebook));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        notebookService.deleteNotebook(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Xóa notebook thành công", null));
    }
}
