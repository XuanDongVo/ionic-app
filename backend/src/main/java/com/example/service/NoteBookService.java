package com.example.service;

import com.example.dto.response.NotebookResponse;
import com.example.entity.Notebook;
import com.example.repository.NotebookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteBookService {

    private final NotebookRepository notebookRepository;

    public List<NotebookResponse> getNoteBooks(Long userId){
        return  notebookRepository.findByUserId(userId).stream().map(this::convertNoteBook).collect(Collectors.toList());
    }


    private NotebookResponse convertNoteBook(Notebook   notebook){
        NotebookResponse notebookResponse = new NotebookResponse();
        notebookResponse.setId(notebook.getId());
        notebookResponse.setTitle(notebook.getName());
        return notebookResponse;
    }
}
