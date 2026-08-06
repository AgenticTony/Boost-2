import { useState } from "react";

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
 * Returns an empty array until Hygraph content models are created.
 */
export const useExercises = () => {
  const [data] = useState<Exercise[]>([]);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  return { data, isLoading, error };
};
