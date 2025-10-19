package com.example.service;

import com.example.dto.request.NotebookCreateRequest;
import com.example.dto.request.NotebookUpdateRequest;
import com.example.dto.response.NotebookResponse;
import com.example.entity.Notebook;
import com.example.entity.User;
import com.example.exception.ResourceNotFoundException;
import com.example.mapper.NotebookMapper;
import com.example.repository.NotebookRepository;
import com.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotebookService {

    private final NotebookRepository notebookRepository;
    private final UserRepository userRepository;
    private final NotebookMapper notebookMapper;

    @Transactional(readOnly = true)
    public List<NotebookResponse> getAllByUser(Long userId) {
        return notebookRepository.findByUserId(userId).stream()
                .map(notebookMapper::toResponse)
                .toList();
    }

    @Transactional
    public NotebookResponse createNotebook(NotebookCreateRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));

        Notebook notebook = notebookMapper.toEntity(request);
        notebook.setUser(user);

        Notebook saved = notebookRepository.save(notebook);
        return notebookMapper.toResponse(saved);
    }

    @Transactional
    public NotebookResponse updateNotebook(Long id, NotebookUpdateRequest request, Long userId) {
        Notebook notebook = notebookRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notebook không tồn tại hoặc không thuộc về bạn"));

        notebookMapper.updateEntity(notebook, request);
        Notebook updated = notebookRepository.save(notebook);
        return notebookMapper.toResponse(updated);
    }

    @Transactional
    public void deleteNotebook(Long id, Long userId) {
        Notebook notebook = notebookRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notebook không tồn tại hoặc không thuộc về bạn"));
        notebookRepository.delete(notebook);
    }
}
