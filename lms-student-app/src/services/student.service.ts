import { apiClient } from "./apiClient";
import { Student } from "@/types";

export const studentService = {
  async getProfile(): Promise<Student> {
    const { data } = await apiClient.get<Student>("/students/me");
    return data;
  },

  async updateProfile(payload: Partial<Student>): Promise<Student> {
    const { data } = await apiClient.patch<Student>("/students/me", payload);
    return data;
  },

  async registerPushToken(pushToken: string): Promise<void> {
    await apiClient.post("/students/me/push-token", { pushToken });
  },
};
