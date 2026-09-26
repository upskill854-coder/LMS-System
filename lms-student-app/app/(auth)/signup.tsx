import { useState } from "react";
import { Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import { InputField } from "@/components/InputField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { authService } from "@/services/auth.service";
import { extractApiErrorMessage } from "@/services/apiClient";
import { useAuthStore } from "@/store/authStore";
import Toast from "react-native-toast-message";

export default function Signup() {
  const router = useRouter();
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Student name is required.";
    if (!/^\+?[0-9]{10,13}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { student, tokens } = await authService.signup({
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        referralCode: form.referralCode || undefined,
      });
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
      <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        <Text className="text-text text-2xl font-bold mb-1">Create your account</Text>
        <Text className="text-muted text-base mb-8">Start learning in minutes</Text>

        <InputField label="Student Name" value={form.name} onChangeText={(v) => setField("name", v)} error={errors.name} />
        <InputField label="Phone Number" value={form.phone} onChangeText={(v) => setField("phone", v)} keyboardType="phone-pad" error={errors.phone} />
        <InputField label="Email" value={form.email} onChangeText={(v) => setField("email", v)} autoCapitalize="none" keyboardType="email-address" error={errors.email} />
        <InputField label="Password" value={form.password} onChangeText={(v) => setField("password", v)} secureTextEntry error={errors.password} />
        <InputField label="Confirm Password" value={form.confirmPassword} onChangeText={(v) => setField("confirmPassword", v)} secureTextEntry error={errors.confirmPassword} />
        <InputField label="Referral / Promo Code (optional)" value={form.referralCode} onChangeText={(v) => setField("referralCode", v)} autoCapitalize="characters" />

        <PrimaryButton label="Create Account" onPress={onSubmit} loading={loading} />

        <View className="flex-row justify-center mt-6">
          <Text className="text-muted text-sm">Already have an account? </Text>
          <Link href="/(auth)/login" className="text-primary text-sm font-semibold">
            Login
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
