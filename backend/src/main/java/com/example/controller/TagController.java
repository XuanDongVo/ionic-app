package com.example.controller;

import com.example.dto.request.TagRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.TagResponse;
import com.example.service.TagService;
import com.example.util.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    // 📘 Lấy tất cả tag của user
    @GetMapping
    public ResponseEntity<ApiResponse<List<TagResponse>>> getAllTags() {
        Long userId = AuthUtils.getCurrentUserId();
        List<TagResponse> tags = tagService.getAllByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tag thành công", tags));
    }

    // ➕ Tạo tag mới
    @PostMapping
    public ResponseEntity<ApiResponse<TagResponse>> createTag(
            @Valid @RequestBody TagRequest request) {
        Long userId = AuthUtils.getCurrentUserId();
        TagResponse tag = tagService.createTag(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo tag thành công", tag));
    }

    // ✏️ Cập nhật tag
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TagResponse>> updateTag(
            @PathVariable Long id,
            @Valid @RequestBody TagRequest request) {
        Long userId = AuthUtils.getCurrentUserId();
        TagResponse tag = tagService.updateTag(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật tag thành công", tag));
    }

    // 🗑️ Xóa tag
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTag(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        tagService.deleteTag(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Xóa tag thành công", null));
    }
}
