import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useEnrollmentDraftStore } from "@/store/enrollmentDraftStore";

export default function PaymentFailed() {
  const router = useRouter();
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const { courseId } = useEnrollmentDraftStore();

  const tryAgain = () => {
    router.replace("/payment/checkout");
  };

  const backToCourse = () => {
    router.replace(courseId ? `/course/${courseId}` : "/(tabs)/courses");
  };

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text style={{ fontSize: 56 }}>⚠️</Text>
      <Text className="text-text text-xl font-bold mt-4 mb-2 text-center">Payment Failed</Text>
      <Text className="text-muted text-sm text-center mb-8">
        {reason || "Your payment could not be completed."}
      </Text>
      <View className="w-full mb-3">
        <PrimaryButton label="TRY AGAIN" onPress={tryAgain} />
      </View>
      <View className="w-full">
        <PrimaryButton label="BACK TO COURSE" onPress={backToCourse} variant="secondary" />
      </View>
    </View>
  );
}
