package com.example.mapper;

import com.example.dto.request.NoteRequest;
import com.example.dto.request.UpdateNoteRequest;
import com.example.dto.response.NoteResponse;
import com.example.dto.response.ReminderResponse;
import com.example.dto.response.TagResponse;
import com.example.entity.Note;
import com.example.entity.Reminder;
import com.example.entity.Tag;
import org.mapstruct.*;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NoteMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "notebookId", source = "notebook.id")
    @Mapping(target = "notebookName", source = "notebook.name")
    @Mapping(target = "parentNoteId", source = "parentNote.id")
    @Mapping(target = "tags", source = "tags", qualifiedByName = "mapTags")
    @Mapping(target = "tagIds", source = "tags", qualifiedByName = "mapTagIds")
    @Mapping(target = "subNotesCount", expression = "java(count(note.getSubNotes()))")
    @Mapping(target = "attachmentsCount", expression = "java(count(note.getAttachments()))")
    @Mapping(target = "reminder", source = "reminder", qualifiedByName = "mapReminder")
    @Mapping(target = "isPinned", source = "pinned")
    @Mapping(target = "isArchived", source = "archived")
    @Mapping(target = "isCompleted", source = "completed")
    NoteResponse toResponse(Note note);

    List<NoteResponse> toResponseList(List<Note> notes);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "notebook", ignore = true)
    @Mapping(target = "parentNote", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "reminder", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "subNotes", ignore = true)
    Note toEntity(NoteRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "notebook", ignore = true)
    @Mapping(target = "parentNote", ignore = true)
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "reminder", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "subNotes", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(UpdateNoteRequest request, @MappingTarget Note note);

    @Named("mapTags")
    default List<TagResponse> mapTags(Set<Tag> tags) {
        if (tags == null) return null;
        return tags.stream()
                .map(t -> TagResponse.builder()
                        .id(t.getId())
                        .name(t.getName())
                        .color(t.getColor())
                        .build())
                .toList();
    }

    @Named("mapTagIds")
    default List<Long> mapTagIds(Set<Tag> tags) {
        if (tags == null) return List.of();
        return tags.stream()
                .map(Tag::getId)
                .toList();
    }

    @Named("mapReminder")
    default ReminderResponse mapReminder(Reminder reminder) {
        if (reminder == null) return null;
        return ReminderResponse.builder()
                .id(reminder.getId())
                .reminderTime(reminder.getReminderTime())
                .repeatType(reminder.getRepeatType())
                .isCompleted(reminder.isCompleted())
                .build();
    }

    default int count(Set<?> collection) {
        return collection != null ? collection.size() : 0;
    }
}
