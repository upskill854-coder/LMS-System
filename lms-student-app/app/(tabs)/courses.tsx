import { useState } from "react";
import { FlatList, Text, View, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCourses } from "@/hooks/useCourses";
import { useMyEnrollments } from "@/hooks/useEnrollments";
import { CourseCard } from "@/components/CourseCard";
import { EmptyState, ErrorState, LoadingSkeletonCard } from "@/components/StateViews";

export default function CoursesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const courses = useCourses(search);
  const enrollments = useMyEnrollments();

  const enrolledCourseIds = new Set(enrollments.data?.map((e) => e.courseId));

  return (
    <View className="flex-1 bg-background pt-14 px-5">
      <Text className="text-text text-xl font-bold mb-4">Explore Courses</Text>

      <View className="flex-row items-center bg-white border border-border rounded-xl px-3 mb-4">
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
          placeholder="Search courses"
          value={search}
          onChangeText={setSearch}
          className="flex-1 py-3 px-2 text-text"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {courses.isLoading && (
        <>
          <LoadingSkeletonCard />
          <LoadingSkeletonCard />
        </>
      )}

      {courses.isError && (
        <ErrorState message="Couldn't load courses." onRetry={() => courses.refetch()} />
      )}

      {courses.data?.courses.length === 0 && (
        <EmptyState title="No courses found" subtitle="Try a different search term." />
      )}

      <FlatList
        data={courses.data?.courses}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <CourseCard
              course={item}
              onPress={() =>
                enrolledCourseIds.has(item.id)
                  ? router.push(`/learning/${item.id}`)
                  : router.push(`/course/${item.id}`)
              }
            />
          </View>
        )}
      />
    </View>
  );
}
