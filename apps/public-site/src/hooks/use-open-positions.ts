import { useQuery } from "@tanstack/react-query";
import { fetchOpenPositions } from "@/api/client";

export function useOpenPositions() {
  return useQuery({
    queryKey: ["openPositions"],
    queryFn: fetchOpenPositions,
  });
}
