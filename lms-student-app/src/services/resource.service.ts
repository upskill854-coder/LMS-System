import { apiClient } from "./apiClient";
import { Resource } from "@/types";

export const resourceService = {
  async getLessonResources(lessonId: string): Promise<Resource[]> {
    const { data } = await apiClient.get<Resource[]>(
      `/lessons/${lessonId}/resources`
    );
    return data;
  },

  // Progress is only ever recorded through an explicit student action
  // (tapping "Mark as Complete"), never implicitly on screen mount.
  async markLessonComplete(lessonId: string): Promise<void> {
    await apiClient.post(`/lessons/${lessonId}/complete`);
  },

  async getCourseProgress(courseId: string): Promise<{
    overallPercent: number;
    modules: { moduleId: string; title: string; percent: number }[];
  }> {
    const { data } = await apiClient.get(`/courses/${courseId}/progress`);
    return data;
  },
};
