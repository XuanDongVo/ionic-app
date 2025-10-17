const API_BASE = "http://localhost:8080/api"; // backend Spring Boot

// ========== DEVELOPMENT MODE - CHỈ DÙNG ĐỂ TEST ==========
// Set thành true để dùng mock data (không cần backend)
const USE_MOCK_DATA = false;
const DEV_MODE = true;
const MOCK_TOKEN = "mock-token-for-testing";

// Mock data cho testing
let mockNotes: any[] = [
    {
        id: 1,
        title: "Note mẫu 1",
        content: "Đây là nội dung note mẫu để test",
        isPinned: false,
        isArchived: false,
        tags: [{ id: 1, name: "Work" }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        title: "Note đã ghim",
        content: "Note này đã được ghim",
        isPinned: true,
        isArchived: false,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

let nextMockId = 3;

// Helper function to get headers with token
function getAuthHeaders() {
    let token = localStorage.getItem("token");

    // Nếu đang ở dev mode và chưa có token, dùng mock token
    if (DEV_MODE && !token) {
        console.warn("⚠️ DEV MODE: Using mock token");
        token = MOCK_TOKEN;
        localStorage.setItem("token", MOCK_TOKEN);
    }

    if (!token) throw new Error("Not logged in");
    
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

// Hàm login - nhận username/password, trả về JWT
export async function login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Login failed");
    }

    const data = await res.json();
    // ví dụ backend trả về { token: "eyJhbGciOi..." }
    localStorage.setItem("token", data.token);
    return data;
}

// Hàm gọi API cần token
export async function getProducts() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");

    const res = await fetch(`${API_BASE}/products`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (res.status === 401) throw new Error("Unauthorized");
    return res.json();
}

// ==================== NOTE (NOTEBOOK) API ====================

// Tạo note mới
export async function createNote(noteData: {
    title: string;
    content?: string;
    notebookId?: number;
    parentNoteId?: number;
    tags?: number[];
    isPinned?: boolean;
    isArchived?: boolean;
}) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newNote = {
                    id: nextMockId++,
                    ...noteData,
                    content: noteData.content || '',
                    isPinned: noteData.isPinned || false,
                    isArchived: noteData.isArchived || false,
                    tags: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                mockNotes.push(newNote);
                resolve({
                    success: true,
                    message: "Tạo note thành công",
                    data: newNote,
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(noteData),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Tạo note thất bại");
    }

    return res.json();
}

// Cập nhật note
export async function updateNote(id: number, noteData: {
    title?: string;
    content?: string;
    notebookId?: number;
    parentNoteId?: number;
    tags?: number[];
    isPinned?: boolean;
    isArchived?: boolean;
}) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const noteIndex = mockNotes.findIndex(n => n.id === id);
                if (noteIndex === -1) {
                    reject(new Error("Không tìm thấy note"));
                    return;
                }
                mockNotes[noteIndex] = {
                    ...mockNotes[noteIndex],
                    ...noteData,
                    updatedAt: new Date().toISOString(),
                };
                resolve({
                    success: true,
                    message: "Cập nhật note thành công",
                    data: mockNotes[noteIndex],
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(noteData),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Cập nhật note thất bại");
    }

    return res.json();
}

// Lấy tất cả notes
export async function getAllNotes() {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Lấy danh sách notes thành công",
                    data: mockNotes.filter(n => !n.isArchived),
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes`, {
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Lấy danh sách notes thất bại");

    return res.json();
}

// Lấy note theo ID
export async function getNoteById(id: number) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const note = mockNotes.find(n => n.id === id);
                if (!note) {
                    reject(new Error("Không tìm thấy note"));
                    return;
                }
                resolve({
                    success: true,
                    message: "Lấy thông tin note thành công",
                    data: note,
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/${id}`, {
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Lấy thông tin note thất bại");

    return res.json();
}

// Xóa note
export async function deleteNote(id: number) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockNotes = mockNotes.filter(n => n.id !== id);
                resolve({
                    success: true,
                    message: "Xóa note thành công",
                    data: null,
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Xóa note thất bại");

    return res.json();
}

// Lấy notes đã pin
export async function getPinnedNotes() {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Lấy danh sách notes đã pin thành công",
                    data: mockNotes.filter(n => n.isPinned),
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/pinned`, {
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Lấy danh sách notes đã pin thất bại");

    return res.json();
}

// Lấy notes đã lưu trữ
export async function getArchivedNotes() {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Lấy danh sách notes đã lưu trữ thành công",
                    data: mockNotes.filter(n => n.isArchived),
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/archived`, {
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Lấy danh sách notes đã lưu trữ thất bại");

    return res.json();
}

// Lấy notes theo notebook
export async function getNotesByNotebook(notebookId: number) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Lấy danh sách notes theo notebook thành công",
                    data: mockNotes.filter(n => n.notebookId === notebookId),
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/notebook/${notebookId}`, {
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Lấy danh sách notes theo notebook thất bại");

    return res.json();
}

// Lấy notes theo tag
export async function getNotesByTag(tagId: number) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Lấy danh sách notes theo tag thành công",
                    data: mockNotes.filter(n => n.tags?.some((t: any) => t.id === tagId)),
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/tag/${tagId}`, {
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Lấy danh sách notes theo tag thất bại");

    return res.json();
}

// Tìm kiếm notes
export async function searchNotes(keyword: string) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const lowerKeyword = keyword.toLowerCase();
                resolve({
                    success: true,
                    message: "Tìm kiếm notes thành công",
                    data: mockNotes.filter(n =>
                        n.title.toLowerCase().includes(lowerKeyword) ||
                        n.content.toLowerCase().includes(lowerKeyword)
                    ),
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/search?keyword=${encodeURIComponent(keyword)}`, {
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Tìm kiếm notes thất bại");

    return res.json();
}

// Lấy sub-notes
export async function getSubNotes(id: number) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Lấy danh sách sub-notes thành công",
                    data: mockNotes.filter(n => n.parentNoteId === id),
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/${id}/sub-notes`, {
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Lấy danh sách sub-notes thất bại");

    return res.json();
}

// Toggle pin note
export async function togglePinNote(id: number) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const noteIndex = mockNotes.findIndex(n => n.id === id);
                if (noteIndex === -1) {
                    reject(new Error("Không tìm thấy note"));
                    return;
                }
                mockNotes[noteIndex].isPinned = !mockNotes[noteIndex].isPinned;
                mockNotes[noteIndex].updatedAt = new Date().toISOString();
                resolve({
                    success: true,
                    message: "Toggle pin thành công",
                    data: mockNotes[noteIndex],
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/${id}/toggle-pin`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Toggle pin thất bại");

    return res.json();
}

// Toggle archive note
export async function toggleArchiveNote(id: number) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const noteIndex = mockNotes.findIndex(n => n.id === id);
                if (noteIndex === -1) {
                    reject(new Error("Không tìm thấy note"));
                    return;
                }
                mockNotes[noteIndex].isArchived = !mockNotes[noteIndex].isArchived;
                mockNotes[noteIndex].updatedAt = new Date().toISOString();
                resolve({
                    success: true,
                    message: "Toggle archive thành công",
                    data: mockNotes[noteIndex],
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/${id}/toggle-archive`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Toggle archive thất bại");

    return res.json();
}

// Cập nhật trạng thái note (completed/incomplete)
export async function updateNoteStatus(id: number, isCompleted: boolean) {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const noteIndex = mockNotes.findIndex(n => n.id === id);
                if (noteIndex === -1) {
                    reject(new Error("Không tìm thấy note"));
                    return;
                }
                mockNotes[noteIndex].isCompleted = isCompleted;
                mockNotes[noteIndex].updatedAt = new Date().toISOString();
                resolve({
                    success: true,
                    message: "Cập nhật trạng thái note thành công",
                    data: mockNotes[noteIndex],
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/${id}/status?isCompleted=${isCompleted}`, {
        method: "PUT",
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Cập nhật trạng thái note thất bại");

    return res.json();
}

// Lấy notes đã hoàn thành
export async function getCompletedNotes() {
    // Mock mode
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Lấy danh sách notes đã hoàn thành thành công",
                    // Giả sử note có thuộc tính 'completed' trong mock data
                    data: mockNotes.filter(n => n.isCompleted),
                });
            }, 300);
        });
    }

    const res = await fetch(`${API_BASE}/notes/completed`, {
        headers: getAuthHeaders(),
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (!res.ok) throw new Error("Lấy danh sách notes đã hoàn thành thất bại");

    return res.json();
}