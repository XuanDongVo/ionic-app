package com.example.controller;

import com.example.dto.response.ApiResponse;
import com.example.dto.response.NoteResponse;
import com.example.dto.response.NotebookResponse;
import com.example.service.NoteBookService;
import com.example.service.NoteService;
import com.example.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/notebook"})
@RequiredArgsConstructor
public class NoteBookController {

    private final NoteBookService noteBookService;
    private final JwtUtil jwtUtil;

    private Long getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotebookResponse>>> getNoteBooks(HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        List<NotebookResponse> notes = noteBookService.getNoteBooks(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách notebooks thành công", notes));
    }
}
