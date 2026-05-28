import { useQuery } from 'urql';

const GET_EXERCISES = `
  query GetExercises {
    exercises {
      id
      title
      description
      duration
      difficulty
      muscleGroups
    }
  }
`;

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  muscleGroups: string;
}

export const useExercises = () => {
  const [result] = useQuery({ query: GET_EXERCISES });
  return {
    data: result.data?.exercises || [],
    isLoading: result.fetching,
    error: result.error,
  };
};