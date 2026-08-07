/**
 * The exercise shape the app works in.
 *
 * Derived from the real Hygraph `Exercise` model - see
 * docs/HYGRAPH_EXERCISE_SCHEMA.md. Mapping happens once, in
 * `api/exercise-mapping.ts`, so a rename in the CMS is a one-file change
 * rather than a hunt through pages.
 */

/** The difficulty labels the UI filters by. */
export const DIFFICULTIES = ["Lätt", "Medel", "Svår"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export interface Exercise {
  /** Hygraph document id. There is no slug on the model, so this is the URL key. */
  id: string;
  title: string;
  description: string;
  /** Minutes. Hygraph stores an Int, so the UI appends the unit. */
  durationMinutes: number;
  /**
   * Hygraph types this as a free String rather than an enumeration, so it can
   * hold anything an editor types. Normalised on the way in; anything
   * unrecognised is kept verbatim for display but will not match a filter.
   */
  difficulty: string;
  /** Split from Hygraph's comma-separated `muscleGroups` string. */
  muscleGroups: string[];
  imageUrl: string | null;
  videoUrl: string | null;
}

/** An exercise plus the step list, fetched only on the detail page. */
export interface ExerciseDetail extends Exercise {
  /**
   * Hygraph stores this as a Json column. In practice it holds an array of
   * strings; anything else is treated as "no steps" rather than rendered raw.
   */
  steps: string[];
}
