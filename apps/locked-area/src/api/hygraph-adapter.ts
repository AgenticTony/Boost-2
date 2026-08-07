import { supabase } from "@/lib/supabase";
import { ContentError, type ContentAdapter } from "@/api/adapter";
import {
  mapExercises,
  mapExerciseDetail,
  type HygraphExercise,
} from "@/api/exercise-mapping";

/**
 * Reads exercises from Hygraph *through* the `hygraph-exercises` edge
 * function.
 *
 * Note what is absent: no GraphQL, no endpoint, no token. public-site's
 * adapter holds all three because its content is public. Here the browser
 * names a query the function already knows and receives data back, so the
 * credential never leaves the server.
 */
async function invoke<T>(
  query: "listExercises" | "exerciseById",
  variables?: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke("hygraph-exercises", {
    body: { query, variables },
  });

  if (error) {
    // supabase-js reports any non-2xx as "Edge Function returned a non-2xx
    // status code", which tells a member nothing. The function's own body
    // carries a code and a Swedish message; prefer those.
    const payload = data as { code?: string; message?: string } | null;
    console.error("hygraph-exercises failed", error);
    throw new ContentError(
      payload?.code ?? "fetch_failed",
      payload?.message ?? "Kunde inte hämta innehållet. Försök igen.",
    );
  }

  return data as T;
}

export function createHygraphAdapter(): ContentAdapter {
  return {
    async fetchExercises() {
      const data = await invoke<{ exercises?: HygraphExercise[] }>(
        "listExercises",
      );
      return mapExercises(data?.exercises ?? []);
    },

    async fetchExerciseById(id) {
      const data = await invoke<{ exercise?: HygraphExercise | null }>(
        "exerciseById",
        { id },
      );
      // A missing entry is `null`, not an error - the page renders a proper
      // "not found" rather than a failure.
      return data?.exercise ? mapExerciseDetail(data.exercise) : null;
    },
  };
}
