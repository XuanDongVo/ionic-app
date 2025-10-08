import axios, { AxiosInstance, AxiosError } from "axios";
import { isPlatform } from "@ionic/react";

export const baseUrl = "http://localhost:8080";

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
    const token = localStorage.getItem("accessToken");
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
