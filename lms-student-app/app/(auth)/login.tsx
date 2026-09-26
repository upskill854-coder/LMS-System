import { useState } from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";
import { InputField } from "@/components/InputField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { authService } from "@/services/auth.service";
import { extractApiErrorMessage } from "@/services/apiClient";
import { useAuthStore } from "@/store/authStore";
import Toast from "react-native-toast-message";

export default function Login() {
  const router = useRouter();
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!identifier.trim()) next.identifier = "Phone number or email is required.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { student, tokens } = await authService.login({ identifier, password });
      await loginSuccess(student, tokens.accessToken, tokens.refreshToken);
      router.replace("/(tabs)/home");
    } catch (error) {
      Toast.show({ type: "error", text1: extractApiErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 justify-center">
          <Text className="text-text text-2xl font-bold mb-1">Welcome back</Text>
          <Text className="text-muted text-base mb-8">Login to continue learning</Text>

          <InputField
            label="Phone Number / Email"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.identifier}
          />
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <View className="items-end mb-6">
            <Link href="/(auth)/forgot-password" className="text-primary text-sm">
              Forgot Password?
            </Link>
          </View>

          <PrimaryButton label="LOGIN" onPress={onSubmit} loading={loading} />

          <View className="flex-row justify-center mt-6">
            <Text className="text-muted text-sm">Don't have an account? </Text>
            <Link href="/(auth)/signup" className="text-primary text-sm font-semibold">
              Create Account
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
