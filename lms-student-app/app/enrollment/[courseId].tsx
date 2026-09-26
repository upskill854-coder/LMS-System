import { useState } from "react";
import { ScrollView, Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useCourseDetails } from "@/hooks/useCourses";
import { useEnrollmentDraftStore } from "@/store/enrollmentDraftStore";
import { InputField } from "@/components/InputField";
import { PromoCodeInput } from "@/components/PromoCodeInput";
import { PaymentSummary } from "@/components/PaymentSummary";
import { PrimaryButton } from "@/components/PrimaryButton";
import { promoService } from "@/services/promo.service";
import { enrollmentService } from "@/services/enrollment.service";
import { extractApiErrorMessage } from "@/services/apiClient";

export default function EnrollmentForm() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();
  const { data: course } = useCourseDetails(courseId);

  const draft = useEnrollmentDraftStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [promoError, setPromoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!draft.studentName.trim()) next.studentName = "Student name is required.";
    if (!/^\+?[0-9]{10,13}$/.test(draft.phone)) next.phone = "Enter a valid phone number.";
    if (!draft.fatherName.trim()) next.fatherName = "Father's name is required.";
    if (!draft.lastQualification.trim()) next.lastQualification = "Last qualification is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onApplyPromo = async () => {
    if (!course) return;
    setPromoError(null);
    try {
      const result = await promoService.validatePromo({
        code: draft.promoCode,
        courseId: course.id,
      });
      if (!result.valid) {
        setPromoError(result.message ?? "This promo code is not valid.");
        draft.setPromoResult(null);
      } else {
        draft.setPromoResult(result);
      }
    } catch (error) {
      setPromoError(extractApiErrorMessage(error));
      draft.setPromoResult(null);
    }
  };

  const onSubmit = async () => {
    if (!course || !validate()) return;
    setSubmitting(true);
    try {
      const order = await enrollmentService.createEnrollment({
        courseId: course.id,
        studentName: draft.studentName,
        phone: draft.phone,
        fatherName: draft.fatherName,
        lastQualification: draft.lastQualification,
        promoCode: draft.promoResult?.valid ? draft.promoCode : undefined,
      });
      draft.setPendingOrder(order);
      router.push("/payment/checkout");
    } catch (error) {
      Toast.show({ type: "error", text1: extractApiErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  };

  if (!course) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted">Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }} keyboardShouldPersistTaps="handled">
        <Text className="text-text text-xl font-bold mb-1">Enroll in {course.title}</Text>
        <Text className="text-muted text-sm mb-6">Fill your details to continue</Text>

        <InputField
          label="Student Name"
          value={draft.studentName}
          onChangeText={(v) => draft.updateField("studentName", v)}
          error={errors.studentName}
        />
        <InputField
          label="Phone Number"
          value={draft.phone}
          onChangeText={(v) => draft.updateField("phone", v)}
          keyboardType="phone-pad"
          error={errors.phone}
        />
        <InputField
          label="Father's Name"
          value={draft.fatherName}
          onChangeText={(v) => draft.updateField("fatherName", v)}
          error={errors.fatherName}
        />
        <InputField
          label="Last Qualification"
          value={draft.lastQualification}
          onChangeText={(v) => draft.updateField("lastQualification", v)}
          error={errors.lastQualification}
        />

        <PromoCodeInput
          value={draft.promoCode}
          onChangeText={(v) => {
            draft.updateField("promoCode", v);
            draft.setPromoResult(null);
            setPromoError(null);
          }}
          onApply={onApplyPromo}
          errorMessage={promoError}
        />

        <View className="mb-6">
          <PaymentSummary
            currency={course.currency}
            originalAmount={course.fee}
            promoResult={draft.promoResult}
          />
        </View>

        <PrimaryButton label="Continue to Payment" onPress={onSubmit} loading={submitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
