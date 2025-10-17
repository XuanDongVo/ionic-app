// Interface cho response data
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

// Interface cho error response
export interface ApiError {
  message: string;
  statusCode?: number;
  timestamp?: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  notebookId?: number;
  parentNoteId?: number;
  tags?: Tag[];
  createdAt?: string;
  updatedAt?: string;
  isCompleted?: boolean;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
}

export interface Notebook {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

export interface NoteFormData {
  title: string;
  content?: string;
  notebookId?: number;
  parentNoteId?: number;
  tags?: number[];
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface NoteCardProps {
  note: Note;
  onToggleStatus?: (id: number) => void;
  onDelete?: (id: number) => void;
}

// User profile models
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  imagePath?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
}

export interface Notebook {
  id: number;
  name: string;
}
