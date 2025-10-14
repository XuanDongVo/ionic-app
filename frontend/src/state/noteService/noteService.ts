import { Notebook, ApiResponse, Note } from "./../../types/index";
import { ApiService } from "../api";

// get list of notebooks
export async function getNotebooks(): Promise<Notebook[]> {
  try {
    const wrapper = await ApiService.get<ApiResponse<Notebook[]>>(
      "/api/notebook"
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

export default {
  getNotebooks,
  getNotesByNotebookId,
  getAllNotes,
};
