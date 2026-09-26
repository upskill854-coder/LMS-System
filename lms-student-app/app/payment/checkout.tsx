import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import RazorpayCheckout from "react-native-razorpay";
import { useEnrollmentDraftStore } from "@/store/enrollmentDraftStore";
import { useAuthStore } from "@/store/authStore";
import { paymentService } from "@/services/payment.service";
import { extractApiErrorMessage } from "@/services/apiClient";

export default function PaymentCheckout() {
  const router = useRouter();
  const { pendingOrder, reset } = useEnrollmentDraftStore();
  const student = useAuthStore((s) => s.student);
  const [status, setStatus] = useState<"opening" | "verifying">("opening");

  useEffect(() => {
    if (!pendingOrder) {
      router.replace("/(tabs)/courses");
      return;
    }
    openCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCheckout = async () => {
    if (!pendingOrder) return;

    try {
      // Razorpay's on-device response is only an intermediate signal.
      // The order is NOT marked paid, and no course access is granted,
      // until the backend independently verifies the signature below.
      const rzpResponse = await RazorpayCheckout.open({
        key: pendingOrder.razorpayKeyId,
        amount: pendingOrder.amount * 100, // paise
        currency: pendingOrder.currency,
        name: process.env.EXPO_PUBLIC_APP_NAME ?? "LMS Student",
        order_id: pendingOrder.orderId,
        prefill: {
          name: student?.name,
          email: student?.email,
          contact: student?.phone,
        },
        theme: { color: "#2563EB" },
      });

      setStatus("verifying");

      const verification = await paymentService.verifyPayment({
        enrollmentId: pendingOrder.enrollmentId,
        razorpay_order_id: rzpResponse.razorpay_order_id,
        razorpay_payment_id: rzpResponse.razorpay_payment_id,
        razorpay_signature: rzpResponse.razorpay_signature,
      });

      if (verification.verified && verification.enrollment.status === "ACTIVE") {
        reset();
        router.replace("/payment/success");
      } else {
        router.replace({
          pathname: "/payment/failed",
          params: { reason: "Payment could not be verified." },
        });
      }
    } catch (error: any) {
      // User cancelled, or Razorpay/backend threw an error.
      const reason =
        error?.description ?? (error ? extractApiErrorMessage(error) : "Payment was cancelled.");
      router.replace({ pathname: "/payment/failed", params: { reason } });
    }
  };

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <ActivityIndicator size="large" color="#2563EB" />
      <Text className="text-text font-medium mt-4">
        {status === "opening" ? "Opening secure checkout..." : "Verifying your payment..."}
      </Text>
    </View>
  );
}
