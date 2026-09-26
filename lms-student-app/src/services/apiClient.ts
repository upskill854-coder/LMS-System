import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { secureStorage } from "@/utils/secureStorage";
import { useAuthStore } from "@/store/authStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  // Fail loudly in development rather than silently hitting an undefined host.
  console.warn(
    "[apiClient] EXPO_PUBLIC_API_URL is not set. Configure your .env file."
  );
}

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await secureStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue the request until the in-flight refresh completes.
        await new Promise<void>((resolve) => pendingQueue.push(resolve));
        return apiClient(originalRequest);
      }

      isRefreshing = true;
      try {
        const refreshToken = await secureStorage.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        await secureStorage.setTokens(data.accessToken, data.refreshToken);
        pendingQueue.forEach((resolve) => resolve());
        pendingQueue = [];
        return apiClient(originalRequest);
      } catch (refreshError) {
        await secureStorage.clearTokens();
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function extractApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return "No internet connection.";
    const data = error.response.data as { message?: string } | undefined;
    if (error.response.status === 401)
      return "Your session has expired. Please login again.";
    if (error.response.status >= 500)
      return "Something went wrong on our end. Please try again.";
    return data?.message ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
