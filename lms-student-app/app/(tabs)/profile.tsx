import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { disconnectSocket } from "@/services/socket";

const MENU_ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; route?: string }[] = [
  { icon: "create-outline", label: "Edit Profile", route: "/profile/edit" },
  { icon: "card-outline", label: "My Payments", route: "/profile/payments" },
  { icon: "notifications-outline", label: "Notifications", route: "/(tabs)/notifications" },
  { icon: "help-circle-outline", label: "Help & Support", route: "/profile/support" },
  { icon: "shield-checkmark-outline", label: "Privacy Policy", route: "/profile/privacy" },
  { icon: "document-text-outline", label: "Terms & Conditions", route: "/profile/terms" },
];

export default function Profile() {
  const router = useRouter();
  const student = useAuthStore((s) => s.student);
  const logout = useAuthStore((s) => s.logout);

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await authService.logout();
          } catch {
            // Even if the server call fails, clear local session.
          }
          disconnectSocket();
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-background pt-14 px-5" showsVerticalScrollIndicator={false}>
      <View className="items-center mb-6">
        {student?.profileImageUrl ? (
          <Image
            source={{ uri: student.profileImageUrl }}
            style={{ width: 88, height: 88, borderRadius: 44 }}
          />
        ) : (
          <View className="w-22 h-22 rounded-full bg-primary/10 items-center justify-center" style={{ width: 88, height: 88 }}>
            <Ionicons name="person" size={40} color="#2563EB" />
          </View>
        )}
        <Text className="text-text font-bold text-lg mt-3">{student?.name}</Text>
        <Text className="text-muted text-sm">{student?.email}</Text>
      </View>

      <View className="bg-card border border-border rounded-2xl p-4 mb-6">
        <InfoRow label="Phone" value={student?.phone} />
        <InfoRow label="Father's Name" value={student?.fatherName} />
        <InfoRow label="Last Qualification" value={student?.lastQualification} />
        <InfoRow
          label="Enrolled Since"
          value={student?.createdAt ? format(new Date(student.createdAt), "MMM yyyy") : undefined}
          last
        />
      </View>

      <View className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        {MENU_ITEMS.map((item, i) => (
          <Pressable
            key={item.label}
            onPress={() => item.route && router.push(item.route as any)}
            className={`flex-row items-center gap-3 px-4 py-4 ${
              i !== MENU_ITEMS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <Ionicons name={item.icon} size={20} color="#64748B" />
            <Text className="text-text flex-1">{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={confirmLogout}
        className="bg-error/10 border border-error rounded-2xl py-4 items-center mb-10"
      >
        <Text className="text-error font-semibold">Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

function InfoRow({ label, value, last }: { label: string; value?: string; last?: boolean }) {
  return (
    <View className={`flex-row justify-between py-2 ${!last ? "border-b border-border" : ""}`}>
      <Text className="text-muted text-sm">{label}</Text>
      <Text className="text-text text-sm font-medium">{value || "—"}</Text>
    </View>
  );
}
