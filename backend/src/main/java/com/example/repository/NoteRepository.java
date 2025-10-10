package com.example.repository;

import com.example.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    // Tìm tất cả note của một user
    List<Note> findByUserId(Long userId);

    // Tìm note của user theo id
    Optional<Note> findByIdAndUserId(Long id, Long userId);

    // Tìm note đã pin của user
    List<Note> findByUserIdAndIsPinnedTrue(Long userId);

    // Tìm note đã lưu trữ của user
    List<Note> findByUserIdAndIsArchivedTrue(Long userId);

    // Tìm note theo notebook
    List<Note> findByNotebookIdAndUserId(Long notebookId, Long userId);

    // Tìm note theo tag
    @Query("SELECT DISTINCT n FROM Note n JOIN n.tags t WHERE t.id = :tagId AND n.user.id = :userId")
    List<Note> findByTagIdAndUserId(@Param("tagId") Long tagId, @Param("userId") Long userId);

    // Tìm kiếm note theo title hoặc content - sử dụng native query để tránh lỗi CLOB
    @Query(value = "SELECT * FROM notes WHERE user_id = :userId AND deleted_at IS NULL AND (LOWER(title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(content) LIKE LOWER(CONCAT('%', :keyword, '%')))", nativeQuery = true)
    List<Note> searchNotes(@Param("userId") Long userId, @Param("keyword") String keyword);

    // Tìm sub-notes của một note
    List<Note> findByParentNoteIdAndUserId(Long parentNoteId, Long userId);
}
