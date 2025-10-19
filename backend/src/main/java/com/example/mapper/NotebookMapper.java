package com.example.mapper;

import com.example.dto.request.NotebookCreateRequest;
import com.example.dto.request.NotebookUpdateRequest;
import com.example.dto.response.NotebookResponse;
import com.example.entity.Notebook;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface NotebookMapper {

    Notebook toEntity(NotebookCreateRequest request);

    void updateEntity(@MappingTarget Notebook entity, NotebookUpdateRequest request);

    NotebookResponse toResponse(Notebook notebook);
}
