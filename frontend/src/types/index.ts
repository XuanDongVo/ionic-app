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
