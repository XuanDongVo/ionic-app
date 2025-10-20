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

    List<Note> findByUserId(Long userId);

    @Query("SELECT n FROM Note n WHERE n.user.id = :userId AND n.isCompleted = false AND n.deletedAt IS NULL")
    List<Note> findAllByUserId(Long userId);


    Optional<Note> findByIdAndUserId(Long id, Long userId);

    List<Note> findByUserIdAndIsPinnedTrue(Long userId);

    List<Note> findByUserIdAndIsArchivedTrue(Long userId);

    List<Note> findByUserIdAndIsCompletedTrue(Long userId);

    List<Note> findByNotebookIdAndUserId(Long notebookId, Long userId);

    @Query("SELECT DISTINCT n FROM Note n JOIN n.tags t WHERE t.id = :tagId AND n.user.id = :userId")
    List<Note> findByTagIdAndUserId(@Param("tagId") Long tagId, @Param("userId") Long userId);

    @Query(value = "SELECT * FROM notes WHERE user_id = :userId AND deleted_at IS NULL AND (LOWER(title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(content) LIKE LOWER(CONCAT('%', :keyword, '%')))", nativeQuery = true)
    List<Note> searchNotes(@Param("userId") Long userId, @Param("keyword") String keyword);

    List<Note> findByParentNoteIdAndUserId(Long parentNoteId, Long userId);

    @Query("""
                SELECT n FROM Note n
                LEFT JOIN FETCH n.user
                LEFT JOIN FETCH n.notebook
                LEFT JOIN FETCH n.tags
                LEFT JOIN FETCH n.reminder
                WHERE n.id = :id
    """)
    Optional<Note> findByIdWithRelations(@Param("id") Long id);

}
