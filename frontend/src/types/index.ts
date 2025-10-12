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
  color: string;
  completed?: boolean;
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