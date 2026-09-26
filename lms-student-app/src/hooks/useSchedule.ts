import { useQuery } from "@tanstack/react-query";
import { classService } from "@/services/class.service";
import { ClassSession } from "@/types";

export function useSchedule() {
  return useQuery({
    queryKey: ["classes", "schedule"],
    queryFn: classService.getSchedule,
    refetchInterval: 30_000, // keep LIVE status reasonably fresh
  });
}

export function getCurrentLiveClass(classes: ClassSession[] | undefined) {
  return classes?.find((c) => c.status === "LIVE") ?? null;
}

export function getNextUpcomingClass(classes: ClassSession[] | undefined) {
  return (
    classes
      ?.filter((c) => c.status === "UPCOMING")
      .sort((a, b) => new Date(a.date + " " + a.startTime).getTime() - new Date(b.date + " " + b.startTime).getTime())[0] ?? null
  );
}
