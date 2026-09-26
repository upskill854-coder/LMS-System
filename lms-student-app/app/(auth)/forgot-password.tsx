import { useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "@/components/InputField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { authService } from "@/services/auth.service";
import { extractApiErrorMessage } from "@/services/apiClient";
import Toast from "react-native-toast-message";

export default function ForgotPassword() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!identifier.trim()) {
      Toast.show({ type: "error", text1: "Enter your phone number or email." });
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(identifier);
      Toast.show({ type: "success", text1: "Reset instructions sent." });
      router.back();
    } catch (error) {
      Toast.show({ type: "error", text1: extractApiErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      <Text className="text-text text-2xl font-bold mb-1">Forgot Password</Text>
      <Text className="text-muted text-base mb-8">
        We'll send you instructions to reset your password.
      </Text>
      <InputField
        label="Phone Number / Email"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
      />
      <PrimaryButton label="Send Reset Link" onPress={onSubmit} loading={loading} />
    </View>
  );
}
