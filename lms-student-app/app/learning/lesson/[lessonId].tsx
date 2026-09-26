import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { lessonService } from "@/services/lesson.service";
import { resourceService } from "@/services/resource.service";
import { extractApiErrorMessage } from "@/services/apiClient";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [completing, setCompleting] = useState(false);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => lessonService.getLessonById(lessonId),
    enabled: !!lessonId,
  });

  const markComplete = async () => {
    setCompleting(true);
    try {
      // Progress is recorded only on this explicit tap, not on screen mount.
      await resourceService.markLessonComplete(lessonId);
      queryClient.invalidateQueries({ queryKey: ["courseProgress"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      Toast.show({ type: "success", text1: "Lesson marked complete." });
    } catch (error) {
      Toast.show({ type: "error", text1: extractApiErrorMessage(error) });
    } finally {
      setCompleting(false);
    }
  };

  if (isLoading || !lesson) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted">Loading lesson...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <Text className="text-text text-xl font-bold mb-4">{lesson.title}</Text>

      {lesson.videoUrl ? (
        <View className="mb-5">
          <VideoPlayer uri={lesson.videoUrl} />
        </View>
      ) : null}

      {lesson.description ? (
        <Text className="text-muted text-sm leading-5 mb-5">{lesson.description}</Text>
      ) : null}

      {lesson.resources.length > 0 && (
        <View className="mb-6">
          <Text className="text-text font-semibold mb-2">Resources</Text>
          {lesson.resources.map((r) => (
            <View
              key={r.id}
              className="flex-row items-center gap-2 bg-card border border-border rounded-xl p-3 mb-2"
            >
              <Ionicons name="document-attach-outline" size={18} color="#2563EB" />
              <Text className="text-text text-sm">{r.title}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="mb-3">
        <PrimaryButton
          label={lesson.isCompleted ? "Marked as Complete" : "Mark as Complete"}
          onPress={markComplete}
          loading={completing}
          disabled={lesson.isCompleted}
          variant={lesson.isCompleted ? "secondary" : "primary"}
        />
      </View>

      {lesson.nextLessonId && (
        <PrimaryButton
          label="Next Lesson"
          variant="secondary"
          onPress={() => router.replace(`/learning/lesson/${lesson.nextLessonId}`)}
        />
      )}
    </ScrollView>
  );
}
