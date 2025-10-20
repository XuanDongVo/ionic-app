import axios, { AxiosInstance, AxiosError } from "axios";
import { isPlatform } from "@ionic/react";

// export const baseUrl = "http://localhost:8080";

// Tự động detect platform và dùng IP phù hợp
// Khi chạy trên thiết bị Android/iOS thật, cần dùng IP của máy tính thay vì localhost
// TODO: Thay đổi IP này thành IP máy tính của bạn khi test trên thiết bị thật
const API_IP = "10.0.2.2"; // THAY ĐỔI IP NÀY!

export const baseUrl =
  isPlatform("capacitor") || isPlatform("cordova")
    ? `http://${API_IP}:8080` // Chạy trên mobile device
    : `http://${API_IP}:8080`; // Chạy trên browser

console.log("API baseUrl:", baseUrl);

export const api: AxiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (
    config: import("axios").InternalAxiosRequestConfig
  ): import("axios").InternalAxiosRequestConfig => {
    // Sử dụng "token" để khớp với Login.tsx
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (isPlatform("capacitor") || isPlatform("cordova")) {
      if (config.headers) {
        config.headers["X-Mobile-App"] = "true";
      }
    }

    return config;
  },
  (error: AxiosError): Promise<never> => {
    console.error("Lỗi khi gửi request:", error);
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response: AxiosResponse): AxiosResponse => {
//     return response;
//   },
//   async (error: AxiosError): Promise<never> => {
//     const originalRequest: AxiosRequestConfig & { _retry?: boolean } =
//       error.config || {};

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         localStorage.removeItem("accessToken");
//         window.location.href = "/login";
//       } catch (refreshError) {
//         console.error("Không thể refresh token:", refreshError);
//         localStorage.removeItem("accessToken");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     if (!error.response) {
//       console.error("Lỗi kết nối mạng. Vui lòng kiểm tra kết nối của bạn.");
//     }

//     return Promise.reject(error);
//   }
// );

// API service class với generic types
export class ApiService {
  static async get<T>(endpoint: string, params?: unknown): Promise<T> {
    const response = await api.get<T>(endpoint, { params });
    return response.data;
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  }

  static async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await api.put<T>(endpoint, data);
    return response.data;
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const response = await api.delete<T>(endpoint);
    return response.data;
  }
}

export default api;

// Profile-specific helpers
export async function fetchProfile(email: string) {
  return ApiService.get<{
    id: string;
    fullName: string;
    email: string;
    imagePath?: string;
  }>("/api/profile", { email });
}

export async function updateProfile(
  email: string,
  data: { fullName?: string; email?: string }
) {
  return ApiService.put<unknown>(
    `/api/profile?email=${encodeURIComponent(email)}`,
    data
  );
}

export async function uploadProfileImage(email: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<{ imagePath: string }>(
    `/api/profile/image?email=${encodeURIComponent(email)}`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
}

//Sử dụng JWT authentication
export interface UserProfileData {
  id: number;
  username: string;
  email: string;
  profileImage: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileApiResponse {
  success: boolean;
  message: string;
  data: UserProfileData;
}

export async function getCurrentUserProfile(): Promise<UserProfileData> {
  const response = await ApiService.get<ProfileApiResponse>("/api/profile/me");
  return response.data;
}

export async function updateCurrentUserProfile(data: {
  username?: string;
  email?: string;
}): Promise<UserProfileData> {
  const response = await ApiService.put<ProfileApiResponse>(
    "/api/profile/me",
    data
  );
  return response.data;
}

export async function uploadCurrentUserImage(
  file: File
): Promise<{ profileImage: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<ProfileApiResponse>(
    "/api/profile/me/image",
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data.data as { profileImage: string };
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const response = await ApiService.put<{
    success: boolean;
    message: string;
    data: null;
  }>("/api/profile/me/change-password", data);
  return response;
}
