import { useState } from "react";
import { ScrollView, Text, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { InputField } from "@/components/InputField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuthStore } from "@/store/authStore";
import { studentService } from "@/services/student.service";
import { extractApiErrorMessage } from "@/services/apiClient";

export default function EditProfile() {
  const router = useRouter();
  const student = useAuthStore((s) => s.student);
  const setStudent = useAuthStore((s) => s.setStudent);

  const [name, setName] = useState(student?.name ?? "");
  const [phone, setPhone] = useState(student?.phone ?? "");
  const [fatherName, setFatherName] = useState(student?.fatherName ?? "");
  const [lastQualification, setLastQualification] = useState(student?.lastQualification ?? "");
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      const updated = await studentService.updateProfile({
        name,
        phone,
        fatherName,
        lastQualification,
      });
      setStudent(updated);
      Toast.show({ type: "success", text1: "Profile updated." });
      router.back();
    } catch (error) {
      Toast.show({ type: "error", text1: extractApiErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <Text className="text-text text-xl font-bold mb-6">Edit Profile</Text>
        <InputField label="Student Name" value={name} onChangeText={setName} />
        <InputField label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <InputField label="Father's Name" value={fatherName} onChangeText={setFatherName} />
        <InputField label="Last Qualification" value={lastQualification} onChangeText={setLastQualification} />
        <PrimaryButton label="Save Changes" onPress={onSave} loading={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
