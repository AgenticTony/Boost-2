import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Exercise content changes when Anna publishes, not per navigation, and
      // every fetch costs an edge invocation plus a Hygraph round trip.
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
