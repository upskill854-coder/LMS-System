import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/course.service";

export function useCourses(search?: string) {
  return useQuery({
    queryKey: ["courses", search ?? ""],
    queryFn: () => courseService.getCourses({ search }),
  });
}

export function useCourseDetails(courseId: string) {
  return useQuery({
    queryKey: ["courses", courseId],
    queryFn: () => courseService.getCourseById(courseId),
    enabled: !!courseId,
  });
}
