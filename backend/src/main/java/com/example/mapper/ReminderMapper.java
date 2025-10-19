package com.example.mapper;

import com.example.dto.response.ReminderResponse;
import com.example.entity.Reminder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReminderMapper {
    @Mapping(target = "noteId", source = "note.id")
    @Mapping(target = "noteTitle", source = "note.title")
    ReminderResponse toResponse(Reminder reminder);
    List<ReminderResponse> toResponseList(List<Reminder> reminders);
}
