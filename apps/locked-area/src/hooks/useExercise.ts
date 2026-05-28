import { useState, useEffect } from 'react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  targetGroup: string;
  content: { html: string };
}

export const useExercise = (id?: string) => {
  const [data, setData] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No exercise ID provided');
      setIsLoading(false);
      return;
    }

    const fetchExercise = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockExercise: Exercise = {
          id,
          title: 'Sample Exercise',
          description: 'This is a placeholder description.',
          duration: '10 min',
          category: 'individuell',
          targetGroup: 'Vuxna',
          content: { html: '<p>Här kommer övningsbeskrivningen...</p>' }
        };
        setData(mockExercise);
      } catch (err) {
        setError('Failed to load exercise');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  return { data, isLoading, error };
};