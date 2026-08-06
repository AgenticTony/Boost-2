import { useEffect, useState } from "react";

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  muscleGroups: string;
}

/**
 * Placeholder data hook for exercises.
 *
 * Returns an empty array until Hygraph content models are created.
 * When the Exercise model exists in Hygraph, replace this with a
 * real GraphQL query using the Supabase client or a direct fetch.
 */
export const useExercises = () => {
  const [data, setData] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Replace with real Hygraph query once Exercise model exists
    // For now, return empty array so the Library page shows its empty state
    setData([]);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
  };
};
