package com.example.service;

import com.example.dto.request.ReminderRequest;
import com.example.dto.response.ReminderResponse;
import com.example.entity.Note;
import com.example.entity.Reminder;
import com.example.exception.ResourceNotFoundException;
import com.example.mapper.ReminderMapper;
import com.example.repository.NoteRepository;
import com.example.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final NoteRepository noteRepository;
    private final ReminderMapper reminderMapper;

    @Transactional
    public ReminderResponse createReminder(ReminderRequest request, Long userId) {
        Note note = noteRepository.findByIdAndUserId(request.getNoteId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note không tồn tại hoặc không thuộc về bạn"));

        Reminder reminder = Reminder.builder()
                .note(note)
                .reminderTime(request.getReminderTime())
                .repeatType(request.getRepeatType())
                .isCompleted(false)
                .isActive(true)
                .build();

        return reminderMapper.toResponse(reminderRepository.save(reminder));
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> getAllReminders(Long userId) {
        return reminderMapper.toResponseList(reminderRepository.findByNoteUserId(userId));
    }

    @Transactional(readOnly = true)
    public ReminderResponse getReminder(Long id, Long userId) {
        Reminder reminder = reminderRepository.findByIdAndNoteUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder không tồn tại hoặc không thuộc về bạn"));
        return reminderMapper.toResponse(reminder);
    }

    @Transactional
    public ReminderResponse updateReminder(Long id, ReminderRequest request, Long userId) {
        Reminder reminder = reminderRepository.findByIdAndNoteUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder không tồn tại hoặc không thuộc về bạn"));

        reminder.setReminderTime(request.getReminderTime());
        reminder.setRepeatType(request.getRepeatType());
        return reminderMapper.toResponse(reminderRepository.save(reminder));
    }

    @Transactional
    public void deleteReminder(Long id, Long userId) {
        Reminder reminder = reminderRepository.findByIdAndNoteUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder không tồn tại hoặc không thuộc về bạn"));
        reminderRepository.delete(reminder);
    }

    @Transactional
    public ReminderResponse toggleComplete(Long id, Long userId) {
        Reminder reminder = reminderRepository.findByIdAndNoteUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder không tồn tại hoặc không thuộc về bạn"));
        reminder.setCompleted(!reminder.isCompleted());
        return reminderMapper.toResponse(reminderRepository.save(reminder));
    }

    @Transactional
    public ReminderResponse toggleActive(Long id, Long userId) {
        Reminder reminder = reminderRepository.findByIdAndNoteUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder không tồn tại hoặc không thuộc về bạn"));
        reminder.setActive(!reminder.isActive());
        return reminderMapper.toResponse(reminderRepository.save(reminder));
    }
}
