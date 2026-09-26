import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useQueryClient } from "@tanstack/react-query";

export default function PaymentSuccess() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const goToCourses = () => {
    queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    router.replace("/(tabs)/courses");
  };

  const startLearning = () => {
    queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    router.replace("/(tabs)/home");
  };

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text style={{ fontSize: 56 }}>🎉</Text>
      <Text className="text-text text-xl font-bold mt-4 mb-2 text-center">
        Enrollment Successful!
      </Text>
      <Text className="text-muted text-sm text-center mb-8">
        Your enrollment is confirmed and your course is now unlocked.
      </Text>
      <View className="w-full mb-3">
        <PrimaryButton label="START LEARNING" onPress={startLearning} />
      </View>
      <View className="w-full">
        <PrimaryButton label="GO TO MY COURSES" onPress={goToCourses} variant="secondary" />
      </View>
    </View>
  );
}
