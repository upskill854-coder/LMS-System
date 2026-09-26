import { RefreshControl, ScrollView, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";
import { useMyEnrollments } from "@/hooks/useEnrollments";
import { useSchedule, getCurrentLiveClass, getNextUpcomingClass } from "@/hooks/useSchedule";
import { useNotifications } from "@/hooks/useNotifications";
import { CourseCard } from "@/components/CourseCard";
import { LiveBanner } from "@/components/LiveBanner";
import { EmptyState, ErrorState, LoadingSkeletonCard } from "@/components/StateViews";
import { format } from "date-fns";

export default function Home() {
  const router = useRouter();
  const student = useAuthStore((s) => s.student);

  const enrollments = useMyEnrollments();
  const schedule = useSchedule();
  const notifications = useNotifications();

  const liveClass = getCurrentLiveClass(schedule.data);
  const nextClass = getNextUpcomingClass(schedule.data);
  const unreadCount = notifications.data?.filter((n) => !n.isRead).length ?? 0;

  const refreshing = enrollments.isFetching || schedule.isFetching;
  const onRefresh = () => {
    enrollments.refetch();
    schedule.refetch();
    notifications.refetch();
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingTop: 60 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-text text-xl font-bold">
          Hello, {student?.name ?? "Student"} 👋
        </Text>
        <View className="flex-row gap-4">
          <Pressable onPress={() => router.push("/(tabs)/notifications")}>
            <Ionicons name="notifications-outline" size={24} color="#0F172A" />
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-error rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-[10px]">{unreadCount}</Text>
              </View>
            )}
          </Pressable>
          <Ionicons name="search-outline" size={24} color="#0F172A" />
        </View>
      </View>

      <LiveBanner
        isLive={!!liveClass}
        title={liveClass?.topic ?? nextClass?.topic ?? "No upcoming class yet"}
        subtitle={
          liveClass
            ? "Your class is currently live."
            : nextClass
            ? `${format(new Date(nextClass.date), "EEE, MMM d")} • ${nextClass.startTime}`
            : "Check back soon for your schedule."
        }
        onJoin={() => liveClass && router.push(`/live/${liveClass.id}`)}
      />

      <Text className="text-text font-semibold text-lg mb-3">My Courses</Text>

      {enrollments.isLoading && (
        <>
          <LoadingSkeletonCard />
          <LoadingSkeletonCard />
        </>
      )}

      {enrollments.isError && (
        <ErrorState message="Couldn't load your courses." onRetry={() => enrollments.refetch()} />
      )}

      {enrollments.data?.length === 0 && (
        <EmptyState
          title="You haven't enrolled in any course yet."
          actionLabel="EXPLORE COURSES"
          onAction={() => router.push("/(tabs)/courses")}
        />
      )}

      {enrollments.data?.map((enrollment) => (
        <CourseCard
          key={enrollment.id}
          course={enrollment.course}
          progressPercent={enrollment.progressPercent}
          nextClassLabel={nextClass ? `${nextClass.topic} • ${nextClass.startTime}` : undefined}
          onPress={() => router.push(`/learning/${enrollment.courseId}`)}
        />
      ))}
    </ScrollView>
  );
}
