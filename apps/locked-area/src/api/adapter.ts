import type { Exercise, ExerciseDetail } from "@/types/exercise";

/**
 * Swappable content source - swap the implementation without touching pages.
 *
 * Mirrors public-site's `api/adapter.ts`. Two implementations exist: the
 * Hygraph adapter (via the edge function) and a mock used in development and
 * tests until the content models are created.
 */
export interface ContentAdapter {
  fetchExercises(): Promise<Exercise[]>;
  fetchExerciseById(id: string): Promise<ExerciseDetail | null>;
}

/** Thrown by adapters so the UI can distinguish "not set up" from "broke". */
export class ContentError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ContentError";
    this.code = code;
  }

  /**
   * True when the content source simply is not configured yet - no Hygraph
   * models, no secrets set. Worth telling members apart from a real failure:
   * "nothing here yet" is accurate, "something went wrong" is not.
   */
  get isNotConfigured() {
    return this.code === "not_configured";
  }
}
