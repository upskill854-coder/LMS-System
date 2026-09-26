import { SectionList, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { isToday, isTomorrow, format } from "date-fns";
import { useSchedule } from "@/hooks/useSchedule";
import { ClassSession } from "@/types";
import { EmptyState, ErrorState, LoadingSkeletonCard } from "@/components/StateViews";

function groupSchedule(classes: ClassSession[]) {
  const today: ClassSession[] = [];
  const tomorrow: ClassSession[] = [];
  const thisWeek: ClassSession[] = [];

  classes.forEach((c) => {
    const date = new Date(c.date);
    if (isToday(date)) today.push(c);
    else if (isTomorrow(date)) tomorrow.push(c);
    else thisWeek.push(c);
  });

  return [
    { title: "Today", data: today },
    { title: "Tomorrow", data: tomorrow },
    { title: "This Week", data: thisWeek },
  ].filter((section) => section.data.length > 0);
}

function StatusBadge({ status }: { status: ClassSession["status"] }) {
  if (status === "LIVE") {
    return <Text className="text-live font-bold text-xs">🔴 LIVE</Text>;
  }
  if (status === "ENDED") return <Text className="text-muted text-xs">Ended</Text>;
  if (status === "CANCELLED") return <Text className="text-error text-xs">Cancelled</Text>;
  return <Text className="text-muted text-xs">Upcoming</Text>;
}

export default function Schedule() {
  const router = useRouter();
  const schedule = useSchedule();

  if (schedule.isLoading) {
    return (
      <View className="flex-1 bg-background pt-14 px-5">
        <LoadingSkeletonCard />
        <LoadingSkeletonCard />
      </View>
    );
  }

  if (schedule.isError) {
    return (
      <View className="flex-1 bg-background pt-14 px-5">
        <ErrorState message="Couldn't load your schedule." onRetry={() => schedule.refetch()} />
      </View>
    );
  }

  const sections = groupSchedule(schedule.data ?? []);

  if (sections.length === 0) {
    return (
      <View className="flex-1 bg-background pt-14 px-5">
        <EmptyState title="No classes scheduled" subtitle="Your upcoming classes will appear here." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-14 px-5">
      <Text className="text-text text-xl font-bold mb-4">Schedule</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text className="text-muted font-semibold text-sm mt-4 mb-2">{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View className="bg-card border border-border rounded-2xl p-4 mb-3 flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-text font-semibold">{item.topic}</Text>
              <Text className="text-muted text-sm mt-0.5">
                {format(new Date(item.date), "MMM d")} • {item.startTime} • {item.teacherName}
              </Text>
              <View className="mt-1">
                <StatusBadge status={item.status} />
              </View>
            </View>
            {item.status === "LIVE" && (
              <Pressable
                onPress={() => router.push(`/live/${item.id}`)}
                className="bg-live px-4 py-2 rounded-xl"
              >
                <Text className="text-white font-semibold text-xs">JOIN</Text>
              </Pressable>
            )}
            {item.status === "ENDED" && item.recordingUrl && (
              <Pressable
                onPress={() => router.push(`/learning/lesson/${item.id}`)}
                className="bg-primary px-4 py-2 rounded-xl"
              >
                <Text className="text-white font-semibold text-xs">WATCH</Text>
              </Pressable>
            )}
          </View>
        )}
      />
    </View>
  );
}
