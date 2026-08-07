/**
 * The only GraphQL this proxy will ever send to Hygraph.
 *
 * Import-free so the edge function and the vitest suite share one definition.
 *
 * Queries are named and looked up by key rather than forwarded from the
 * client. An edge function that relays arbitrary GraphQL is not a proxy, it is
 * the Hygraph API with the credential attached - any signed-in member could
 * read models they have no business seeing, or send mutations. The client may
 * choose *which* of these runs and pass variables; it can never compose one.
 *
 * Fields match the real Exercise model. Note there is no `slug`, so the
 * document id is the URL key.
 */

export const EXERCISE_FIELDS = `
  id
  title
  description
  duration
  difficulty
  muscleGroups
  videoUrl
  image { url }
`;

export const QUERIES = {
  listExercises: `
    query ListExercises {
      exercises(orderBy: title_ASC, stage: PUBLISHED) {
        ${EXERCISE_FIELDS}
      }
    }
  `,
  exerciseById: `
    query ExerciseById($id: ID!) {
      exercise(where: { id: $id }, stage: PUBLISHED) {
        ${EXERCISE_FIELDS}
        steps
      }
    }
  `,
} as const;

export type QueryKey = keyof typeof QUERIES;

export function isQueryKey(value: unknown): value is QueryKey {
  return typeof value === "string" && Object.hasOwn(QUERIES, value);
}

/**
 * Variables are whitelisted per query for the same reason the queries are.
 * `exerciseById` takes an id and nothing else; anything extra is dropped
 * rather than forwarded.
 */
export function pickVariables(
  key: QueryKey,
  raw: unknown,
): Record<string, unknown> {
  if (key !== "exerciseById") return {};

  const id =
    raw && typeof raw === "object" && "id" in raw
      ? (raw as { id: unknown }).id
      : undefined;

  return typeof id === "string" ? { id } : {};
}
