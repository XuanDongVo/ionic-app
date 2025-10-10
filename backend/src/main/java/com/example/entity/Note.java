package com.example.entity;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE notes SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob // Dành cho nội dung dài
    private String content;

    @Column(length = 7) // vd: #FFFFFF
    private String color;

    @Column(name = "is_pinned")
    private boolean isPinned = false;

    @Column(name = "is_archived")
    private boolean isArchived = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // Dùng cho soft delete

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Ghi chú này có thể thuộc về sổ tay nào (có thể null)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notebook_id")
    private Notebook notebook;

    // --- MỐI QUAN HỆ CHA-CON (MAIN NOTE & SUB-NOTES) ---
    // Một ghi chú có thể là con của một ghi chú khác
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_note_id")
    private Note parentNote;

    // Một ghi chú có thể có nhiều ghi chú con
    @OneToMany(mappedBy = "parentNote", cascade = CascadeType.ALL)
    private Set<Note> subNotes = new HashSet<>();

    // --- CÁC MỐI QUAN HỆ KHÁC ---
    // Một ghi chú có thể có nhiều thẻ
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "note_tags",
            joinColumns = @JoinColumn(name = "note_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    // Một ghi chú có thể có nhiều tệp đính kèm
    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Attachment> attachments = new HashSet<>();

    // Một ghi chú chỉ có một lời nhắc
    @OneToOne(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
    private Reminder reminder;
}
