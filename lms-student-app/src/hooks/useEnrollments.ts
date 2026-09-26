import { useQuery } from "@tanstack/react-query";
import { enrollmentService } from "@/services/enrollment.service";

export function useMyEnrollments() {
  return useQuery({
    queryKey: ["enrollments", "me"],
    queryFn: enrollmentService.getMyEnrollments,
  });
}
