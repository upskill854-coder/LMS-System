import { apiClient } from "./apiClient";
import { Enrollment, PendingOrder } from "@/types";

export interface CreateEnrollmentPayload {
  courseId: string;
  studentName: string;
  phone: string;
  fatherName: string;
  lastQualification: string;
  promoCode?: string;
}

export const enrollmentService = {
  // Creates a PENDING enrollment + Razorpay order on the backend.
  // No course access is granted at this step.
  async createEnrollment(payload: CreateEnrollmentPayload): Promise<PendingOrder> {
    const { data } = await apiClient.post<PendingOrder>("/enrollments", payload);
    return data;
  },

  async getMyEnrollments(): Promise<Enrollment[]> {
    const { data } = await apiClient.get<Enrollment[]>("/enrollments/me");
    return data;
  },

  async getEnrollmentById(enrollmentId: string): Promise<Enrollment> {
    const { data } = await apiClient.get<Enrollment>(`/enrollments/${enrollmentId}`);
    return data;
  },
};
