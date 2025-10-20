const API_BASE = "http://10.0.2.2:8080/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

const mapApiResponseToNote = (apiNote: any) => ({
    ...apiNote,
    isPinned: apiNote.pinned,
    isArchived: apiNote.archived,
    isCompleted: apiNote.completed,
});

const createNote = async (noteData: any) => {
    const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error((await res.text()) || "Tạo note thất bại");
    const responseData = await res.json();
    return { data: mapApiResponseToNote(responseData.data || responseData) };
};

const updateNote = async (id: number, noteData: any) => {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error((await res.text()) || "Cập nhật note thất bại");
    const responseData = await res.json();
    return { data: mapApiResponseToNote(responseData.data || responseData) };
};

const getAllNotes = async () => {
    const res = await fetch(`${API_BASE}/notes`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Lấy danh sách notes thất bại");
    const responseData = await res.json();
    const notes = responseData.data || responseData;
    return { data: Array.isArray(notes) ? notes.map(mapApiResponseToNote) : [] };
};

const getNoteById = async (id: number) => {
    const res = await fetch(`${API_BASE}/notes/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Lấy thông tin note thất bại");
    const responseData = await res.json();
    return { data: mapApiResponseToNote(responseData.data || responseData) };
};

const deleteNote = async (id: number) => {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Xóa note thất bại");
    return await res.json();
};

const getPinnedNotes = async () => {
    const res = await fetch(`${API_BASE}/notes/pinned`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Lấy danh sách notes đã pin thất bại");
    const responseData = await res.json();
    const notes = responseData.data || responseData;
    return { data: Array.isArray(notes) ? notes.map(mapApiResponseToNote) : [] };
};

const getArchivedNotes = async () => {
    const res = await fetch(`${API_BASE}/notes/archived`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Lấy danh sách notes đã lưu trữ thất bại");
    const responseData = await res.json();
    const notes = responseData.data || responseData;
    return { data: Array.isArray(notes) ? notes.map(mapApiResponseToNote) : [] };
};

const togglePinNote = async (id: number) => {
    const res = await fetch(`${API_BASE}/notes/${id}/toggle-pin`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Toggle pin thất bại");
    const responseData = await res.json();
    return { data: mapApiResponseToNote(responseData.data || responseData) };
};

export const toggleArchiveNote = async (id: number) => {
    const res = await fetch(`${API_BASE}/notes/${id}/toggle-archive`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Toggle archive thất bại");
    const responseData = await res.json();
    return { data: mapApiResponseToNote(responseData.data || responseData) };
};

const getCompletedNotes = async () => {
    const res = await fetch(`${API_BASE}/notes/completed`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Lấy danh sách notes đã hoàn thành thất bại");
    const responseData = await res.json();
    const notes = responseData.data || responseData;
    return { data: Array.isArray(notes) ? notes.map(mapApiResponseToNote) : [] };
};

export const noteApi = {
    createNote,
    updateNote,
    getAllNotes,
    getNoteById,
    deleteNote,
    getPinnedNotes,
    getArchivedNotes,
    togglePinNote,
    toggleArchiveNote,
    getCompletedNotes,
};
