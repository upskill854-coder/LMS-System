import { apiClient } from "./apiClient";
import { AppNotification } from "@/types";

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    const { data } = await apiClient.get<AppNotification[]>("/notifications");
    return data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch("/notifications/read-all");
  },
};
