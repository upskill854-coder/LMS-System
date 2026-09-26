import { create } from "zustand";
import { Student } from "@/types";
import { secureStorage } from "@/utils/secureStorage";

interface AuthState {
  student: Student | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setStudent: (student: Student | null) => void;
  setBootstrapped: () => void;
  loginSuccess: (student: Student, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  student: null,
  isAuthenticated: false,
  isBootstrapping: true,

  setStudent: (student) => set({ student, isAuthenticated: !!student }),

  setBootstrapped: () => set({ isBootstrapping: false }),

  loginSuccess: async (student, accessToken, refreshToken) => {
    await secureStorage.setTokens(accessToken, refreshToken);
    set({ student, isAuthenticated: true });
  },

  logout: async () => {
    await secureStorage.clearTokens();
    set({ student: null, isAuthenticated: false });
  },
}));
