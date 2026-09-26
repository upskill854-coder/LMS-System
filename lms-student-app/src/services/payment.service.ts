import { apiClient } from "./apiClient";
import { Payment } from "@/types";

export interface VerifyPaymentPayload {
  enrollmentId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  verified: boolean;
  enrollment: {
    id: string;
    status: "ACTIVE" | "PENDING" | "FAILED";
  };
}

export const paymentService = {
  // IMPORTANT: this is the ONLY call that can move an enrollment to ACTIVE.
  // The Razorpay "success" callback on-device is never treated as final;
  // the backend verifies the signature server-side before granting access.
  async verifyPayment(payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> {
    const { data } = await apiClient.post<VerifyPaymentResponse>(
      "/payments/verify",
      payload
    );
    return data;
  },

  async getPaymentHistory(): Promise<Payment[]> {
    const { data } = await apiClient.get<Payment[]>("/payments/me");
    return data;
  },
};
