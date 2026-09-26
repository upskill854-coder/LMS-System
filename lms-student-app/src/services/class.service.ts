import { apiClient } from "./apiClient";
import { ClassSession } from "@/types";

export const classService = {
  // The backend enforces batch membership; the client only ever
  // receives classes the student is actually allowed to see.
  async getSchedule(): Promise<ClassSession[]> {
    const { data } = await apiClient.get<ClassSession[]>("/classes/schedule");
    return data;
  },

  async getClassById(classId: string): Promise<ClassSession> {
    const { data } = await apiClient.get<ClassSession>(`/classes/${classId}`);
    return data;
  },
};
