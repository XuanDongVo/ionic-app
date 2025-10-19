package com.example.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "note")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false, length = 512)
    private String fileUrl;

    @Column(nullable = false, length = 100)
    private String fileType;

    private Long fileSize;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;
}
