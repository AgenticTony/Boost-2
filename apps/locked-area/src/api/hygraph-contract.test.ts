import { describe, it, expect } from "vitest";
import { mapExercises, mapExerciseDetail } from "@/api/exercise-mapping";
import live from "@/test/hygraph-live-response.json";

/**
 * Contract test against a captured live Hygraph response.
 *
 * The fixture in `hygraph-live-response.json` is the real payload the
 * production queries returned from the project, not something written by hand.
 * Hand-written fixtures test the mapper against the schema the author *thought*
 * existed - which is exactly the mistake this feature already made once, when
 * the model turned out to have `duration`/`muscleGroups`/`steps` rather than
 * the `durationMinutes`/`focusAreas`/`instructions` that had been assumed.
 *
 * Re-capture it if the Hygraph model changes; a failure here means the CMS and
 * the mapper have drifted apart.
 */
describe("Hygraph contract — list query", () => {
  const exercises = mapExercises(live.exercises);

  it("maps every entry the live query returned", () => {
    expect(live.exercises.length).toBeGreaterThan(0);
    expect(exercises).toHaveLength(live.exercises.length);
  });

  it("produces a usable card from real data", () => {
    const [first] = exercises;
    expect(first.id).toBeTruthy();
    expect(first.title).toBeTruthy();
    // The three things a card renders and cannot fake.
    expect(first.durationMinutes).toBeGreaterThan(0);
    expect(first.difficulty).not.toBe("");
    expect(first.muscleGroups.length).toBeGreaterThan(0);
  });

  it("splits the real comma-separated muscleGroups string", () => {
    const raw = live.exercises[0].muscleGroups ?? "";
    expect(raw).toContain(",");
    expect(exercises[0].muscleGroups.length).toBe(raw.split(",").length);
    // No stray whitespace survives into the chips.
    for (const group of exercises[0].muscleGroups) {
      expect(group).toBe(group.trim());
      expect(group).not.toBe("");
    }
  });

  it("normalises the real difficulty to a filterable value", () => {
    // If this fails, the exercise renders but no filter button will match it.
    expect(["Lätt", "Medel", "Svår"]).toContain(exercises[0].difficulty);
  });
});

describe("Hygraph contract — detail query", () => {
  it("maps the real steps array into a step list", () => {
    const detail = mapExerciseDetail(live.exercise);
    expect(detail).not.toBeNull();
    // `steps` is a Json column, so its real shape is worth pinning down.
    expect(Array.isArray(live.exercise.steps)).toBe(true);
    expect(detail!.steps.length).toBe(live.exercise.steps.length);
    for (const step of detail!.steps) {
      expect(typeof step).toBe("string");
      expect(step.trim()).not.toBe("");
    }
  });
});
