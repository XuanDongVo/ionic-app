package com.example.controller;

import com.example.dto.request.ReminderRequest;
import com.example.dto.response.ApiResponse;
import com.example.dto.response.ReminderResponse;
import com.example.service.ReminderService;
import com.example.util.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReminderResponse>>> getAll() {
        Long userId = AuthUtils.getCurrentUserId();
        List<ReminderResponse> reminders = reminderService.getAllReminders(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách reminder thành công", reminders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReminderResponse>> getById(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        ReminderResponse reminder = reminderService.getReminder(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy reminder thành công", reminder));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReminderResponse>> create(
            @Valid @RequestBody ReminderRequest request) {
        Long userId = AuthUtils.getCurrentUserId();
        ReminderResponse reminder = reminderService.createReminder(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo reminder thành công", reminder));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReminderResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ReminderRequest request) {
        Long userId = AuthUtils.getCurrentUserId();
        ReminderResponse reminder = reminderService.updateReminder(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật reminder thành công", reminder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        reminderService.deleteReminder(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Xóa reminder thành công", null));
    }

    @PatchMapping("/{id}/toggle-complete")
    public ResponseEntity<ApiResponse<ReminderResponse>> toggleComplete(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        ReminderResponse reminder = reminderService.toggleComplete(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái hoàn thành thành công", reminder));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<ReminderResponse>> toggleActive(@PathVariable Long id) {
        Long userId = AuthUtils.getCurrentUserId();
        ReminderResponse reminder = reminderService.toggleActive(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái kích hoạt thành công", reminder));
    }
}
