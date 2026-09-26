import { apiClient } from "./apiClient";
import { Course } from "@/types";

export interface CourseListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CourseListResponse {
  courses: Course[];
  total: number;
  page: number;
  pageSize: number;
}

export const courseService = {
  async getCourses(params: CourseListParams = {}): Promise<CourseListResponse> {
    const { data } = await apiClient.get<CourseListResponse>("/courses", { params });
    return data;
  },

  async getCourseById(courseId: string): Promise<Course> {
    const { data } = await apiClient.get<Course>(`/courses/${courseId}`);
    return data;
  },
};
