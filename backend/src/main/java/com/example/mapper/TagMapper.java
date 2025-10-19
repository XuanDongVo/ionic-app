package com.example.mapper;

import com.example.dto.request.TagRequest;
import com.example.dto.response.TagResponse;
import com.example.entity.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TagMapper {

    Tag toEntity(TagRequest request);

    void updateEntity(@MappingTarget Tag entity, TagRequest request);

    TagResponse toResponse(Tag tag);
}
