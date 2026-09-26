import { apiClient } from "./apiClient";
import { LiveSessionToken } from "@/types";

export const liveService = {
  // Backend checks: authenticated, enrolled, correct batch, class currently
  // LIVE. Only then does it mint a viewer-only session token from the
  // WebRTC-compatible provider. The client never talks to the provider
  // without this token, and never requests publisher (camera/mic) rights.
  async joinClass(classId: string): Promise<LiveSessionToken> {
    const { data } = await apiClient.post<LiveSessionToken>(
      `/live/${classId}/join`
    );
    return data;
  },

  async leaveClass(classId: string): Promise<void> {
    await apiClient.post(`/live/${classId}/leave`);
  },
};
