import {
  DIFFICULTIES,
  type Exercise,
  type ExerciseDetail,
} from "@/types/exercise";

/**
 * Hygraph -> app translation, in one place.
 *
 * Everything defensive here exists because GraphQL does not error on a field
 * absent from the schema - it returns null. So a rename in Hygraph arrives as
 * `undefined` at runtime rather than as a failed request, and a mapper that
 * trusted its input would put "undefined min" on screen.
 */

/** Raw shape returned by the queries in `_shared/exercise-queries.ts`. */
export interface HygraphExercise {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  duration?: number | null;
  difficulty?: string | null;
  /** Comma-separated in the CMS: "Quadriceps, Hamstrings, Core". */
  muscleGroups?: string | null;
  videoUrl?: string | null;
  image?: { url?: string | null } | null;
  /** Json column. Expected to be an array of strings. */
  steps?: unknown;
}

/**
 * Hygraph types `difficulty` as a free String, not an enumeration, so an
 * editor can type anything. Known values are normalised to the exact casing
 * the filter buttons use; anything else is passed through untouched so it is
 * still readable on the card, even though no filter will match it.
 */
export function normaliseDifficulty(raw: string | null | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const known = DIFFICULTIES.find(
    (d) => d.toLowerCase() === trimmed.toLowerCase(),
  );
  return known ?? trimmed;
}

/** Splits the CMS's comma-separated string, dropping blanks. */
export function splitMuscleGroups(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

/**
 * `steps` is a Json column, so it can legitimately hold anything. Only an
 * array of non-empty strings is usable; anything else becomes "no steps"
 * rather than being rendered as `[object Object]`.
 */
export function parseSteps(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (step): step is string =>
      typeof step === "string" && step.trim().length > 0,
  );
}

/**
 * @returns null when the entry lacks the fields the UI cannot render without.
 *
 * Dropping one bad row beats a card titled "undefined" linking to
 * /exercise/null. The caller filters these out and logs the count.
 */
export function mapExercise(raw: HygraphExercise): Exercise | null {
  if (!raw.id || !raw.title) return null;

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? "",
    durationMinutes:
      typeof raw.duration === "number" && raw.duration > 0 ? raw.duration : 0,
    difficulty: normaliseDifficulty(raw.difficulty),
    muscleGroups: splitMuscleGroups(raw.muscleGroups),
    imageUrl: raw.image?.url ?? null,
    videoUrl: raw.videoUrl ?? null,
  };
}

export function mapExerciseDetail(raw: HygraphExercise): ExerciseDetail | null {
  const base = mapExercise(raw);
  if (!base) return null;
  return { ...base, steps: parseSteps(raw.steps) };
}

/** Maps a list, dropping unusable entries and reporting how many. */
export function mapExercises(rows: HygraphExercise[]): Exercise[] {
  const mapped = rows.map(mapExercise);
  const usable = mapped.filter((e): e is Exercise => e !== null);

  if (usable.length !== mapped.length) {
    console.warn(
      `Dropped ${mapped.length - usable.length} exercise(s) missing id or title.`,
    );
  }

  return usable;
}
