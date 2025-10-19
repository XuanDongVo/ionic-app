package com.example.service;

import com.example.dto.request.TagRequest;
import com.example.dto.response.TagResponse;
import com.example.entity.Tag;
import com.example.entity.User;
import com.example.exception.ResourceNotFoundException;
import com.example.mapper.TagMapper;
import com.example.repository.TagRepository;
import com.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final TagMapper tagMapper;

    @Transactional(readOnly = true)
    public List<TagResponse> getAllByUser(Long userId) {
        return tagRepository.findByUserId(userId).stream()
                .map(tagMapper::toResponse)
                .toList();
    }

    @Transactional
    public TagResponse createTag(TagRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));

        Tag tag = tagMapper.toEntity(request);
        tag.setUser(user);

        Tag saved = tagRepository.save(tag);
        return tagMapper.toResponse(saved);
    }

    @Transactional
    public TagResponse updateTag(Long id, TagRequest request, Long userId) {
        Tag tag = tagRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag không tồn tại hoặc không thuộc về bạn"));

        tagMapper.updateEntity(tag, request);
        Tag updated = tagRepository.save(tag);
        return tagMapper.toResponse(updated);
    }

    @Transactional
    public void deleteTag(Long id, Long userId) {
        Tag tag = tagRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag không tồn tại hoặc không thuộc về bạn"));
        tagRepository.delete(tag);
    }
}
