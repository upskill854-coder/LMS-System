import { apiClient } from "./apiClient";
import { AuthTokens, Student } from "@/types";

export interface LoginPayload {
  identifier: string; // email or phone
  password: string;
}

export interface SignupPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
}

interface AuthResponse {
  student: Student;
  tokens: AuthTokens;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/signup", payload);
    return data;
  },

  async forgotPassword(identifier: string): Promise<{ message: string }> {
    const { data } = await apiClient.post("/auth/forgot-password", { identifier });
    return data;
  },

  async resetPassword(payload: {
    identifier: string;
    otp: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const { data } = await apiClient.post("/auth/reset-password", payload);
    return data;
  },

  async verifyOtp(payload: { identifier: string; otp: string }): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/verify-otp", payload);
    return data;
  },

  async me(): Promise<Student> {
    const { data } = await apiClient.get<Student>("/auth/me");
    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
};
