import { apiClient } from "./apiClient";
import { PromoValidationResult } from "@/types";

export const promoService = {
  // The backend is the single source of truth for discount calculation.
  // This call only forwards the code; the client never computes price itself.
  async validatePromo(payload: {
    code: string;
    courseId: string;
  }): Promise<PromoValidationResult> {
    const { data } = await apiClient.post<PromoValidationResult>(
      "/promo/validate",
      payload
    );
    return data;
  },
};
