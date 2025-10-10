package com.example.util;

import com.example.entity.*;
import com.example.repository.NoteRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    @PersistenceContext
    private EntityManager entityManager;

    private final NoteRepository noteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Kiểm tra xem đã có data chưa
        long noteCount = noteRepository.count();

        if (noteCount > 0) {
            log.info("Database đã có {} notes. Bỏ qua seed data.", noteCount);
            return;
        }

        log.info("Bắt đầu seed data...");

        // Tạo Users
        User user1 = createUser("john_doe", "john@example.com", "password123");
        User user2 = createUser("jane_smith", "jane@example.com", "password456");

        entityManager.persist(user1);
        entityManager.persist(user2);
        entityManager.flush();

        log.info("Đã tạo {} users", 2);

        // Tạo Notebooks cho user1
        Notebook notebook1 = createNotebook("Công việc", user1);
        Notebook notebook2 = createNotebook("Cá nhân", user1);
        Notebook notebook3 = createNotebook("Học tập", user1);

        entityManager.persist(notebook1);
        entityManager.persist(notebook2);
        entityManager.persist(notebook3);
        entityManager.flush();

        log.info("Đã tạo {} notebooks", 3);

        // Tạo Tags cho user1
        Tag tag1 = createTag("Quan trọng", "#FF0000", user1);
        Tag tag2 = createTag("Công việc", "#0000FF", user1);
        Tag tag3 = createTag("Cá nhân", "#00FF00", user1);
        Tag tag4 = createTag("Gấp", "#FFA500", user1);

        entityManager.persist(tag1);
        entityManager.persist(tag2);
        entityManager.persist(tag3);
        entityManager.persist(tag4);
        entityManager.flush();

        log.info("Đã tạo {} tags", 4);

        // Tạo Notes cho user1
        Note note1 = createNote(
                "Họp team buổi sáng",
                "Nội dung cuộc họp:\n- Review sprint hiện tại\n- Lên kế hoạch sprint mới\n- Phân công công việc",
                "#FFEB3B",
                true,
                false,
                user1,
                notebook1
        );
        note1.getTags().add(tag1);
        note1.getTags().add(tag2);

        Note note2 = createNote(
                "Danh sách mua sắm",
                "- Sữa\n- Bánh mì\n- Trứng\n- Rau củ\n- Thịt",
                "#4CAF50",
                false,
                false,
                user1,
                notebook2
        );
        note2.getTags().add(tag3);

        Note note3 = createNote(
                "Ý tưởng dự án mới",
                "Xây dựng ứng dụng quản lý công việc với các tính năng:\n1. To-do list\n2. Calendar\n3. Reminder\n4. Team collaboration",
                "#2196F3",
                true,
                false,
                user1,
                notebook1
        );
        note3.getTags().add(tag1);
        note3.getTags().add(tag2);
        note3.getTags().add(tag4);

        Note note4 = createNote(
                "Học Spring Boot",
                "Các chủ đề cần học:\n- Spring Security\n- Spring Data JPA\n- REST API\n- Microservices",
                "#9C27B0",
                false,
                false,
                user1,
                notebook3
        );

        Note note5 = createNote(
                "Ghi chú đã lưu trữ",
                "Đây là một ghi chú cũ đã được lưu trữ",
                "#757575",
                false,
                true,
                user1,
                notebook2
        );

        entityManager.persist(note1);
        entityManager.persist(note2);
        entityManager.persist(note3);
        entityManager.persist(note4);
        entityManager.persist(note5);
        entityManager.flush();

        log.info("Đã tạo {} notes", 5);

        // Tạo Sub-notes
        Note subNote1 = createNote(
                "Chi tiết họp - Point 1",
                "Review các task đã hoàn thành",
                "#FFEB3B",
                false,
                false,
                user1,
                notebook1
        );
        subNote1.setParentNote(note1);

        Note subNote2 = createNote(
                "Chi tiết họp - Point 2",
                "Thảo luận các vấn đề gặp phải",
                "#FFEB3B",
                false,
                false,
                user1,
                notebook1
        );
        subNote2.setParentNote(note1);

        entityManager.persist(subNote1);
        entityManager.persist(subNote2);
        entityManager.flush();

        log.info("Đã tạo {} sub-notes", 2);

        // Tạo Reminders
        Reminder reminder1 = createReminder(
                LocalDateTime.now().plusDays(1).withHour(9).withMinute(0),
                "DAILY",
                false,
                note1
        );

        Reminder reminder2 = createReminder(
                LocalDateTime.now().plusDays(2).withHour(14).withMinute(30),
                "ONCE",
                false,
                note3
        );

        entityManager.persist(reminder1);
        entityManager.persist(reminder2);
        entityManager.flush();

        log.info("Đã tạo {} reminders", 2);

        // Tạo một số notes cho user2
        Notebook notebook4 = createNotebook("My Notes", user2);
        entityManager.persist(notebook4);

        Note note6 = createNote(
                "Welcome Note",
                "This is my first note!",
                "#FF5722",
                true,
                false,
                user2,
                notebook4
        );

        entityManager.persist(note6);
        entityManager.flush();

        log.info("✅ Seed data hoàn tất!");
        log.info("📊 Tổng kết:");
        log.info("   - Users: 2");
        log.info("   - Notebooks: 4");
        log.info("   - Tags: 4");
        log.info("   - Notes: 6 (bao gồm 2 sub-notes)");
        log.info("   - Reminders: 2");
        log.info("🔑 Thông tin đăng nhập:");
        log.info("   User 1: username=john_doe, password=password123");
        log.info("   User 2: username=jane_smith, password=password456");
    }

    private User createUser(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Encode password
        user.setNotes(new HashSet<>());
        user.setNotebooks(new HashSet<>());
        user.setTags(new HashSet<>());
        return user;
    }

    private Notebook createNotebook(String name, User user) {
        Notebook notebook = new Notebook();
        notebook.setName(name);
        notebook.setUser(user);
        notebook.setNotes(new HashSet<>());
        return notebook;
    }

    private Tag createTag(String name, String color, User user) {
        Tag tag = new Tag();
        tag.setName(name);
        tag.setColor(color);
        tag.setUser(user);
        tag.setNotes(new HashSet<>());
        return tag;
    }

    private Note createNote(String title, String content, String color,
                            boolean isPinned, boolean isArchived,
                            User user, Notebook notebook) {
        Note note = new Note();
        note.setTitle(title);
        note.setContent(content);
        note.setColor(color);
        note.setPinned(isPinned);
        note.setArchived(isArchived);
        note.setUser(user);
        note.setNotebook(notebook);
        note.setTags(new HashSet<>());
        note.setSubNotes(new HashSet<>());
        note.setAttachments(new HashSet<>());
        return note;
    }

    private Reminder createReminder(LocalDateTime reminderTime, String repeatType,
                                    boolean isCompleted, Note note) {
        Reminder reminder = new Reminder();
        reminder.setReminderTime(reminderTime);
        reminder.setRepeatType(repeatType);
        reminder.setCompleted(isCompleted);
        reminder.setActive(true);
        reminder.setNote(note);
        return reminder;
    }
}

