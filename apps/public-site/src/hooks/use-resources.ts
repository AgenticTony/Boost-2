import { useQuery } from "@tanstack/react-query";
import { fetchResources, fetchResourcesByCategory } from "@/api/client";

export function useResources(category: string) {
  return useQuery({
    queryKey: ["resources", category],
    queryFn: async () => {
      if (category === "alla") return fetchResources();
      return fetchResourcesByCategory(category);
    },
  });
}
