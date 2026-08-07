import { describe, it, expect, vi, afterEach } from "vitest";
import {
  normaliseDifficulty,
  splitMuscleGroups,
  parseSteps,
  mapExercise,
  mapExerciseDetail,
  mapExercises,
  type HygraphExercise,
} from "@/api/exercise-mapping";

/** Mirrors the real published entry: "Knäböj med stång". */
const complete: HygraphExercise = {
  id: "abc",
  title: "Knäböj med stång",
  description: "Grundövning för ben och bål.",
  duration: 45,
  difficulty: "Medel",
  muscleGroups: "Quadriceps, Hamstrings, Gluteus, Core",
  videoUrl: null,
  image: null,
};

afterEach(() => vi.restoreAllMocks());

describe("normaliseDifficulty", () => {
  it("passes the three known labels through", () => {
    for (const label of ["Lätt", "Medel", "Svår"]) {
      expect(normaliseDifficulty(label)).toBe(label);
    }
  });

  it("corrects casing and stray whitespace", () => {
    // Hygraph types this as a free String, not an enumeration, so an editor
    // can type "medel" or " Svår " and the filter would silently never match.
    expect(normaliseDifficulty("medel")).toBe("Medel");
    expect(normaliseDifficulty("  svår ")).toBe("Svår");
    expect(normaliseDifficulty("LÄTT")).toBe("Lätt");
  });

  it("keeps an unrecognised value rather than discarding it", () => {
    // Still readable on the card; simply will not match a filter.
    expect(normaliseDifficulty("Extrem")).toBe("Extrem");
  });

  it("returns an empty string for a missing value", () => {
    expect(normaliseDifficulty(null)).toBe("");
    expect(normaliseDifficulty(undefined)).toBe("");
  });
});

describe("splitMuscleGroups", () => {
  it("splits the CMS's comma-separated string", () => {
    expect(splitMuscleGroups("Quadriceps, Hamstrings, Core")).toEqual([
      "Quadriceps",
      "Hamstrings",
      "Core",
    ]);
  });

  it("trims and drops empties from sloppy input", () => {
    expect(splitMuscleGroups("Ben,, Core ,")).toEqual(["Ben", "Core"]);
  });

  it("returns an empty array when the field is unset", () => {
    expect(splitMuscleGroups(null)).toEqual([]);
    expect(splitMuscleGroups("")).toEqual([]);
  });
});

describe("parseSteps", () => {
  it("keeps an array of strings", () => {
    expect(parseSteps(["Ett", "Två"])).toEqual(["Ett", "Två"]);
  });

  it("drops blanks", () => {
    expect(parseSteps(["Ett", "", "   ", "Två"])).toEqual(["Ett", "Två"]);
  });

  it("treats a non-array Json value as no steps", () => {
    // `steps` is a Json column, so it can hold anything. Rendering a stray
    // object would print "[object Object]" into the instructions.
    expect(parseSteps({ one: "Ett" })).toEqual([]);
    expect(parseSteps("Ett")).toEqual([]);
    expect(parseSteps(null)).toEqual([]);
    expect(parseSteps(undefined)).toEqual([]);
  });

  it("drops non-string entries inside the array", () => {
    expect(parseSteps(["Ett", 2, null, { x: 1 }, "Tre"])).toEqual([
      "Ett",
      "Tre",
    ]);
  });
});

describe("mapExercise", () => {
  it("maps a complete entry", () => {
    expect(mapExercise(complete)).toEqual({
      id: "abc",
      title: "Knäböj med stång",
      description: "Grundövning för ben och bål.",
      durationMinutes: 45,
      difficulty: "Medel",
      muscleGroups: ["Quadriceps", "Hamstrings", "Gluteus", "Core"],
      imageUrl: null,
      videoUrl: null,
    });
  });

  it.each(["id", "title"] as const)("returns null when %s is missing", (f) => {
    // GraphQL returns null for a field absent from the schema rather than
    // erroring, so a rename in Hygraph arrives here as undefined. Dropping the
    // row beats a card titled "undefined" linking to /exercise/null.
    expect(mapExercise({ ...complete, [f]: null })).toBeNull();
  });

  it("defaults the optional fields rather than passing null through", () => {
    expect(mapExercise({ id: "a", title: "T" })).toMatchObject({
      description: "",
      durationMinutes: 0,
      muscleGroups: [],
      imageUrl: null,
      videoUrl: null,
    });
  });

  it("rejects a nonsensical duration", () => {
    expect(mapExercise({ ...complete, duration: -5 })?.durationMinutes).toBe(0);
    expect(mapExercise({ ...complete, duration: null })?.durationMinutes).toBe(
      0,
    );
  });

  it("reads the asset url", () => {
    expect(
      mapExercise({ ...complete, image: { url: "https://media/x.jpg" } })
        ?.imageUrl,
    ).toBe("https://media/x.jpg");
  });
});

describe("mapExerciseDetail", () => {
  it("carries the steps through", () => {
    const detail = mapExerciseDetail({
      ...complete,
      steps: ["Stå med fötterna axelbrett isär", "Sänk dig ner"],
    });
    expect(detail?.steps).toHaveLength(2);
  });

  it("is an empty list when the field is unset", () => {
    expect(mapExerciseDetail(complete)?.steps).toEqual([]);
  });
});

describe("mapExercises", () => {
  it("keeps usable rows and drops the rest", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = mapExercises([
      complete,
      { id: "x" },
      { ...complete, id: "d2" },
    ]);

    expect(result).toHaveLength(2);
    // Silent dropping would hide a schema mismatch entirely.
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Dropped 1"));
  });

  it("says nothing when every row is usable", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(mapExercises([complete])).toHaveLength(1);
    expect(warn).not.toHaveBeenCalled();
  });

  it("handles an empty list", () => {
    expect(mapExercises([])).toEqual([]);
  });
});
