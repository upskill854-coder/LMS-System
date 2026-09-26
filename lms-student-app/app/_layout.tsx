import "../global.css";
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { queryClient } from "@/services/queryClient";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { secureStorage } from "@/utils/secureStorage";
import AsyncStorageFallback from "@/utils/localFlag";

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isBootstrapping, setStudent, setBootstrapped } =
    useAuthStore();

  useEffect(() => {
    (async () => {
      const token = await secureStorage.getAccessToken();
      if (!token) {
        setBootstrapped();
        return;
      }
      try {
        const student = await authService.me();
        setStudent(student);
      } catch {
        await secureStorage.clearTokens();
        setStudent(null);
      } finally {
        setBootstrapped();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isBootstrapping) return;
    const inAuthGroup = segments[0] === "(auth)";

    (async () => {
      if (!isAuthenticated && !inAuthGroup) {
        const onboarded = await AsyncStorageFallback.isOnboardingComplete();
        router.replace(onboarded ? "/(auth)/login" : "/(auth)/onboarding");
      } else if (isAuthenticated && inAuthGroup) {
        router.replace("/(tabs)/home");
      }
    })();
  }, [isAuthenticated, isBootstrapping, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="course/[id]" />
            <Stack.Screen name="enrollment/[courseId]" />
            <Stack.Screen name="payment/checkout" />
            <Stack.Screen name="payment/success" />
            <Stack.Screen name="payment/failed" />
            <Stack.Screen name="learning/[courseId]" />
            <Stack.Screen name="learning/lesson/[lessonId]" />
            <Stack.Screen name="live/[classId]" />
          </Stack>
        </AuthGate>
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
