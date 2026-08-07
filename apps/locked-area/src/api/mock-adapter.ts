import type { ContentAdapter } from "@/api/adapter";
import type { Exercise, ExerciseDetail } from "@/types/exercise";

/**
 * Development and test fixtures.
 *
 * These are **not** real training material and must never reach members. The
 * real content is Anna's to write in Hygraph; inventing exercises and shipping
 * them would put made-up methodology in front of youth workers who would
 * reasonably assume it had been reviewed.
 *
 * `client.ts` therefore never falls back to this in production - a deliberate
 * divergence from public-site, whose resilient adapter degrades to mock data
 * on failure. That is fine for marketing copy and wrong for this.
 *
 * The titles say so out loud, so a screenshot of mock data is obvious.
 */
const FIXTURES: ExerciseDetail[] = [
  {
    id: "mock-1",
    title: "[Exempel] Uppvärmning i cirkel",
    description:
      "Platshållare för utveckling. Riktigt innehåll läggs in i Hygraph.",
    durationMinutes: 10,
    difficulty: "Lätt",
    muscleGroups: ["Hela kroppen"],
    imageUrl: null,
    videoUrl: null,
    steps: ["Platshållarsteg ett.", "Platshållarsteg två."],
  },
  {
    id: "mock-2",
    title: "[Exempel] Samarbetsövning",
    description:
      "Platshållare för utveckling. Riktigt innehåll läggs in i Hygraph.",
    durationMinutes: 25,
    difficulty: "Medel",
    muscleGroups: ["Kommunikation", "Lagbygge"],
    imageUrl: null,
    videoUrl: "https://example.com/video",
    steps: ["Platshållarsteg ett."],
  },
  {
    id: "mock-3",
    title: "[Exempel] Reflektion och avslutning",
    description:
      "Platshållare för utveckling. Riktigt innehåll läggs in i Hygraph.",
    durationMinutes: 15,
    difficulty: "Svår",
    muscleGroups: ["Reflektion"],
    imageUrl: null,
    videoUrl: null,
    steps: [],
  },
];

export function createMockAdapter(): ContentAdapter {
  return {
    async fetchExercises(): Promise<Exercise[]> {
      return FIXTURES.map(({ steps: _ignored, ...rest }) => rest);
    },
    async fetchExerciseById(id) {
      return FIXTURES.find((e) => e.id === id) ?? null;
    },
  };
}
