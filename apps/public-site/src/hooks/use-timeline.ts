import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "@/api/client";

export function useTimeline() {
  return useQuery({
    queryKey: ["timeline"],
    queryFn: fetchTimeline,
  });
}
