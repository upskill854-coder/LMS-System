import { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCourseDetails } from "@/hooks/useCourses";
import { useMyEnrollments } from "@/hooks/useEnrollments";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useSchedule } from "@/hooks/useSchedule";
import { ModuleAccordion } from "@/components/ModuleAccordion";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/StateViews";
import { format } from "date-fns";

const TABS = ["Overview", "Lessons", "Live Classes", "Resources", "Progress"] as const;
type Tab = (typeof TABS)[number];

export default function CourseDashboard() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Overview");

  const { data: course } = useCourseDetails(courseId);
  const { data: enrollments } = useMyEnrollments();
  const { data: progress } = useCourseProgress(courseId);
  const { data: schedule } = useSchedule();

  const enrollment = enrollments?.find((e) => e.courseId === courseId);
  const courseClasses = schedule?.filter((c) => c.courseId === courseId) ?? [];

  if (!course || !enrollment) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted">Loading course...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-14">
      <View className="px-5 mb-3">
        <Text className="text-text text-xl font-bold mb-2">{course.title}</Text>
        <ProgressBar percent={enrollment.progressPercent} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-5 mb-4"
        contentContainerStyle={{ gap: 8 }}
      >
        {TABS.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            className={`px-4 py-2 rounded-full ${tab === t ? "bg-primary" : "bg-card border border-border"}`}
          >
            <Text className={tab === t ? "text-white font-medium text-sm" : "text-muted text-sm"}>
              {t}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {tab === "Overview" && (
          <Text className="text-muted text-sm leading-5 pb-8">{course.overview}</Text>
        )}

        {tab === "Lessons" && (
          <View className="pb-8">
            {course.modules.map((module, i) => (
              <ModuleAccordion
                key={module.id}
                module={module}
                index={i}
                onLessonPress={(lessonId) => router.push(`/learning/lesson/${lessonId}`)}
              />
            ))}
          </View>
        )}

        {tab === "Live Classes" && (
          <View className="pb-8">
            {courseClasses.length === 0 ? (
              <EmptyState title="No live classes scheduled yet" />
            ) : (
              courseClasses.map((c) => (
                <View
                  key={c.id}
                  className="bg-card border border-border rounded-2xl p-4 mb-3 flex-row justify-between items-center"
                >
                  <View className="flex-1">
                    <Text className="text-text font-semibold">{c.topic}</Text>
                    <Text className="text-muted text-sm mt-0.5">
                      {format(new Date(c.date), "MMM d")} • {c.startTime} • {c.teacherName}
                    </Text>
                  </View>
                  {c.status === "LIVE" && (
                    <Pressable
                      onPress={() => router.push(`/live/${c.id}`)}
                      className="bg-live px-4 py-2 rounded-xl"
                    >
                      <Text className="text-white font-semibold text-xs">JOIN</Text>
                    </Pressable>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {tab === "Resources" && (
          <View className="pb-8">
            {course.modules
              .flatMap((m) => m.lessons)
              .flatMap((l) => l.resources)
              .map((resource) => (
                <View
                  key={resource.id}
                  className="bg-card border border-border rounded-2xl p-4 mb-3"
                >
                  <Text className="text-text font-medium">{resource.title}</Text>
                  <Text className="text-muted text-xs mt-0.5">{resource.type}</Text>
                </View>
              ))}
          </View>
        )}

        {tab === "Progress" && (
          <View className="pb-8">
            <Text className="text-text font-semibold text-lg mb-1">Course Progress</Text>
            <Text className="text-primary text-2xl font-bold mb-4">
              {progress?.overallPercent ?? enrollment.progressPercent}%
            </Text>
            {progress?.modules.map((m) => (
              <View key={m.moduleId} className="mb-4">
                <Text className="text-text text-sm font-medium mb-1">{m.title}</Text>
                <ProgressBar percent={m.percent} showLabel />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
