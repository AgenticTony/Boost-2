import { useQuery } from "@tanstack/react-query";
import { fetchExercises, fetchExerciseById } from "@/api/client";

export function useExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });
}

export function useExercise(id: string | undefined) {
  return useQuery({
    queryKey: ["exercise", id],
    queryFn: () => fetchExerciseById(id!),
    // Without an id there is nothing to ask for; skip the request rather than
    // fetching `undefined` and letting the adapter deal with it.
    enabled: Boolean(id),
  });
}
