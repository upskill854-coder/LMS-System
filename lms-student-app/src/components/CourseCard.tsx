import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { ProgressBar } from "./ProgressBar";
import { Course } from "@/types";

interface Props {
  course: Course;
  progressPercent?: number;
  nextClassLabel?: string;
  onPress: () => void;
}

export function CourseCard({ course, progressPercent, nextClassLabel, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-card rounded-2xl overflow-hidden mb-4 border border-border"
    >
      <Image
        source={{ uri: course.thumbnailUrl }}
        style={{ width: "100%", height: 140 }}
        contentFit="cover"
      />
      <View className="p-4">
        <Text className="text-text font-semibold text-base mb-1">{course.title}</Text>
        {progressPercent !== undefined ? (
          <>
            <ProgressBar percent={progressPercent} />
            {nextClassLabel ? (
              <Text className="text-muted text-xs mt-2">Next: {nextClassLabel}</Text>
            ) : null}
          </>
        ) : (
          <Text className="text-muted text-sm" numberOfLines={2}>
            {course.shortDescription}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
