import { Notebook, ApiResponse, Note } from "./../../types/index";
import { ApiService } from "../api";

// get list of notebooks
export async function getNotebooks(): Promise<Notebook[]> {
  try {
    const wrapper = await ApiService.get<ApiResponse<Notebook[]>>(
      "/api/notebooks"
    );
    return wrapper.data;
  } catch (err) {
    console.error("Error fetching notebooks:", err);
    throw err;
  }
}

// get list note by notebook id
export async function getNotesByNotebookId(
  notebookId: number
): Promise<Note[]> {
  try {
    const wrapper = await ApiService.get<ApiResponse<Note[]>>(
      `/api/notes/notebook/${notebookId}`
    );
    return wrapper.data;
  } catch (err) {
    console.error("Error fetching notes:", err);
    throw err;
  }
}

export async function getAllNotes(): Promise<Note[]> {
  try {
    const wrapper = await ApiService.get<ApiResponse<Note[]>>(`/api/notes`);
    return wrapper.data;
  } catch (err) {
    console.error("Error fetching notes:", err);
    throw err;
  }
}

export async function searchNotes(keyWord: string): Promise<Note[]> {
  try {
    const wrapper = await ApiService.get<ApiResponse<Note[]>>(
      `/api/notes/search?keyword=${encodeURIComponent(keyWord)}`
    );
    return wrapper.data;
  } catch (err) {
    console.error("Error searching notes:", err);
    throw err;
  }
}

// LẤY DANH SÁCH NOTE ĐÃ HOÀN THÀNH
export async function getCompletedNotes(): Promise<Note[]> {
  try {
    const wrapper = await ApiService.get<ApiResponse<Note[]>>(`/api/notes/completed`);
    return wrapper.data;
  } catch (err) {
    console.error("Error fetching completed notes:", err);
    throw err;
  }
}

// Cập nhật trạng thái hoàn thành của note
export async function updateNoteStatus(noteId: number, isCompleted: boolean): Promise<Note> {
  try {
    const endpoint = `/api/notes/${noteId}/status?isCompleted=${isCompleted}`;
    // API giờ trả về cấu trúc { success, message, data }
    const response = await ApiService.put<ApiResponse<Note>>(endpoint, {});
    // Trả về note nằm trong thuộc tính 'data'
    return response.data;
  } catch (err) {
    console.error("Error updating note status:", err);
    throw err;
  }
}

export default {
  getNotebooks,
  getNotesByNotebookId,
  getAllNotes,
  updateNoteStatus,
  searchNotes,
  getCompletedNotes,
};
