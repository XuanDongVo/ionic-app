package com.example.repository;

import com.example.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    Optional<Reminder> findByNoteId(Long noteId);

    @Query("SELECT r FROM Reminder r WHERE r.note.user.id = :userId AND r.isActive = true")
    List<Reminder> findActiveRemindersByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM Reminder r WHERE r.reminderTime <= :time AND r.isActive = true AND r.isCompleted = false")
    List<Reminder> findUpcomingReminders(@Param("time") LocalDateTime time);
}

