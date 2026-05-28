import { useQuery } from "@tanstack/react-query";
import { fetchNewsBySlug } from "@/api/client";

export function useNewsBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["news", slug],
    queryFn: () => {
      if (!slug) throw new Error("slug is required");
      return fetchNewsBySlug(slug);
    },
    enabled: !!slug,
  });
}
