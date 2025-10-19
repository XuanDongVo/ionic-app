package com.example.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@SQLDelete(sql = "UPDATE notes SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@ToString(exclude = {"user", "notebook", "parentNote", "subNotes", "tags", "attachments", "reminder"})
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    private String content;

    @Column(length = 7)
    private String color;

    @Column(name = "is_pinned")
    @Builder.Default
    private boolean isPinned = false;

    @Column(name = "is_archived")
    @Builder.Default
    private boolean isArchived = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notebook_id")
    private Notebook notebook;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_note_id")
    private Note parentNote;

    @OneToMany(mappedBy = "parentNote", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Note> subNotes = new HashSet<>();

    @Column(name = "is_completed")
    @Builder.Default
    private boolean isCompleted = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "note_tags",
            joinColumns = @JoinColumn(name = "note_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Attachment> attachments = new HashSet<>();

    @OneToOne(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
    private Reminder reminder;
}
