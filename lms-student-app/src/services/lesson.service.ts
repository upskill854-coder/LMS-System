import { apiClient } from "./apiClient";
import { Lesson } from "@/types";

export const lessonService = {
  async getLessonById(lessonId: string): Promise<Lesson & { nextLessonId?: string | null }> {
    const { data } = await apiClient.get(`/lessons/${lessonId}`);
    return data;
  },
};
