import type { ContentAdapter } from "@/api/adapter";
import { createHygraphAdapter } from "@/api/hygraph-adapter";
import { createMockAdapter } from "@/api/mock-adapter";

/**
 * The active content source. Pages import from here and never touch an
 * adapter directly.
 *
 * Hygraph is on in production and opt-in during development, matching
 * public-site's convention.
 *
 * Deliberately *not* wrapped in a resilient fallback. public-site degrades to
 * mock data when Hygraph is unreachable, which is right for marketing copy: a
 * slightly stale news list beats a broken page. It is wrong here. These are
 * fixtures labelled "[Exempel]", and quietly serving them to a youth worker
 * looking for a session plan is worse than an honest error. A failure surfaces
 * as a failure.
 */
const useHygraph =
  import.meta.env.PROD || import.meta.env.VITE_USE_HYGRAPH === "true";

const adapter: ContentAdapter = useHygraph
  ? createHygraphAdapter()
  : createMockAdapter();

export const fetchExercises = () => adapter.fetchExercises();
export const fetchExerciseById = (id: string) => adapter.fetchExerciseById(id);

/** Exposed for tests and for the dev-mode banner. */
export const isUsingHygraph = useHygraph;
