import { useQuery } from "@tanstack/react-query";
import { resourceService } from "@/services/resource.service";

export function useCourseProgress(courseId: string) {
  return useQuery({
    queryKey: ["courseProgress", courseId],
    queryFn: () => resourceService.getCourseProgress(courseId),
    enabled: !!courseId,
  });
}
