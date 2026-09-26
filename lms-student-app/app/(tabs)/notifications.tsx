import { FlatList, Text, View, Pressable } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationService } from "@/services/notification.service";
import { EmptyState, ErrorState, LoadingSkeletonCard } from "@/components/StateViews";
import { AppNotification } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";

const ICONS: Record<AppNotification["type"], keyof typeof Ionicons.glyphMap> = {
  CLASS_SCHEDULED: "calendar-outline",
  CLASS_LIVE: "radio-outline",
  ANNOUNCEMENT: "megaphone-outline",
  PAYMENT: "card-outline",
  LESSON: "play-circle-outline",
  RESOURCE: "document-attach-outline",
};

export default function Notifications() {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const markRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch {
      // Non-critical; ignore silently, next refetch will resync state.
    }
  };

  if (notifications.isLoading) {
    return (
      <View className="flex-1 bg-background pt-14 px-5">
        <LoadingSkeletonCard />
        <LoadingSkeletonCard />
      </View>
    );
  }

  if (notifications.isError) {
    return (
      <View className="flex-1 bg-background pt-14 px-5">
        <ErrorState message="Couldn't load notifications." onRetry={() => notifications.refetch()} />
      </View>
    );
  }

  if (!notifications.data || notifications.data.length === 0) {
    return (
      <View className="flex-1 bg-background pt-14 px-5">
        <EmptyState title="No notifications yet" subtitle="We'll let you know when something needs your attention." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-14 px-5">
      <Text className="text-text text-xl font-bold mb-4">Notifications</Text>
      <FlatList
        data={notifications.data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => !item.isRead && markRead(item.id)}
            className={`flex-row items-start gap-3 rounded-2xl border p-4 mb-3 ${
              item.isRead ? "bg-card border-border" : "bg-primary/5 border-primary/30"
            }`}
          >
            <Ionicons name={ICONS[item.type]} size={22} color="#2563EB" />
            <View className="flex-1">
              <Text className="text-text font-semibold">{item.title}</Text>
              <Text className="text-muted text-sm mt-0.5">{item.body}</Text>
              <Text className="text-muted text-xs mt-1">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </Text>
            </View>
            {!item.isRead && <View className="w-2 h-2 rounded-full bg-primary mt-1.5" />}
          </Pressable>
        )}
      />
    </View>
  );
}
