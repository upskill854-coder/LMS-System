import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CourseModule } from "@/types";

interface Props {
  module: CourseModule;
  index: number;
  onLessonPress?: (lessonId: string) => void;
}

export function ModuleAccordion({ module, index, onLessonPress }: Props) {
  const [open, setOpen] = useState(index === 0);

  return (
    <View className="bg-card border border-border rounded-2xl mb-3 overflow-hidden">
      <Pressable
        onPress={() => setOpen((o) => !o)}
        className="flex-row items-center justify-between p-4"
      >
        <Text className="text-text font-semibold flex-1">
          Module {index + 1} — {module.title}
        </Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color="#64748B" />
      </Pressable>

      {open && (
        <View className="px-4 pb-4">
          {module.lessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              disabled={lesson.isLocked}
              onPress={() => onLessonPress?.(lesson.id)}
              className="flex-row items-center gap-2 py-2"
            >
              <Ionicons
                name={lesson.isLocked ? "lock-closed" : lesson.isCompleted ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={lesson.isLocked ? "#94A3B8" : lesson.isCompleted ? "#16A34A" : "#94A3B8"}
              />
              <Text className={`text-sm ${lesson.isLocked ? "text-muted" : "text-text"}`}>
                {lesson.title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
