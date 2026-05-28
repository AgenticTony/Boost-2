import { useQuery } from 'urql';

const GET_ARTICLES = `
  query GetExercises {
    exercises {
      id
      title
      slug
      description
      duration
      difficulty
      category
    }
  }
`;

export const useArticles = () => {
  const [result] = useQuery({ query: GET_ARTICLES });
  return {
    data: result.data?.exercises || [],
    isLoading: result.fetching,
    error: result.error,
  };
};