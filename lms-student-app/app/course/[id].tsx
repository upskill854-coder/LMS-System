import { ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useCourseDetails } from "@/hooks/useCourses";
import { ModuleAccordion } from "@/components/ModuleAccordion";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ErrorState } from "@/components/StateViews";
import { Ionicons } from "@expo/vector-icons";
import { useEnrollmentDraftStore } from "@/store/enrollmentDraftStore";

export default function CourseDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: course, isLoading, isError, refetch } = useCourseDetails(id);
  const setCourse = useEnrollmentDraftStore((s) => s.setCourse);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted">Loading course...</Text>
      </View>
    );
  }

  if (isError || !course) {
    return (
      <View className="flex-1 bg-background justify-center px-6">
        <ErrorState message="Couldn't load this course." onRetry={refetch} />
      </View>
    );
  }

  const onEnroll = () => {
    setCourse(course.id);
    router.push(`/enrollment/${course.id}`);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: course.bannerUrl }} style={{ width: "100%", height: 200 }} contentFit="cover" />

        <View className="px-5 pt-5">
          <Text className="text-text text-2xl font-bold mb-3">{course.title}</Text>

          <View className="flex-row flex-wrap gap-2 mb-5">
            <Tag icon="time-outline" label={course.durationLabel} />
            <Tag icon="language-outline" label={course.language} />
            <Tag icon="bar-chart-outline" label={course.level} />
            <Tag icon="play-circle-outline" label={`${course.totalClasses} classes`} />
          </View>

          <Text className="text-text font-semibold text-lg mb-2">Overview</Text>
          <Text className="text-muted text-sm leading-5 mb-5">{course.overview}</Text>

          <Text className="text-text font-semibold text-lg mb-2">What You'll Learn</Text>
          <View className="mb-5">
            {course.learnPoints.map((point) => (
              <View key={point} className="flex-row items-center gap-2 mb-1.5">
                <Ionicons name="checkmark" size={16} color="#16A34A" />
                <Text className="text-text text-sm">{point}</Text>
              </View>
            ))}
          </View>

          {course.requirements.length > 0 && (
            <>
              <Text className="text-text font-semibold text-lg mb-2">Requirements</Text>
              <View className="mb-5">
                {course.requirements.map((req) => (
                  <Text key={req} className="text-muted text-sm mb-1">• {req}</Text>
                ))}
              </View>
            </>
          )}

          <Text className="text-text font-semibold text-lg mb-3">Syllabus</Text>
          {course.modules.map((module, i) => (
            <ModuleAccordion key={module.id} module={module} index={i} />
          ))}

          {course.faqs.length > 0 && (
            <>
              <Text className="text-text font-semibold text-lg mt-3 mb-3">FAQs</Text>
              {course.faqs.map((faq, i) => (
                <View key={faq.question} className="bg-card border border-border rounded-2xl mb-3 p-4">
                  <Text
                    onPress={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="text-text font-medium"
                  >
                    {faq.question}
                  </Text>
                  {faqOpen === i && (
                    <Text className="text-muted text-sm mt-2">{faq.answer}</Text>
                  )}
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex-row items-center justify-between">
        <View>
          <Text className="text-muted text-xs">Course Fee</Text>
          <Text className="text-text text-xl font-bold">
            {course.currency} {course.fee}
          </Text>
        </View>
        <View style={{ width: 180 }}>
          <PrimaryButton label="ENROLL NOW" onPress={onEnroll} />
        </View>
      </View>
    </View>
  );
}

function Tag({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View className="flex-row items-center gap-1 bg-primary/10 rounded-full px-3 py-1.5">
      <Ionicons name={icon} size={14} color="#2563EB" />
      <Text className="text-primary text-xs font-medium">{label}</Text>
    </View>
  );
}
