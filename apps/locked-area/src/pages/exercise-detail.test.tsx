import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import ExerciseDetail from "@/pages/exercise-detail";
import { renderWithProviders } from "@/test/test-utils";
import { signedInAs } from "@/test/supabase-mock";
import { ContentError } from "@/api/adapter";
import type { ExerciseDetail as ExerciseDetailType } from "@/types/exercise";
import * as client from "@/api/client";

const EXERCISE: ExerciseDetailType = {
  id: "e1",
  title: "Uppvärmning i cirkel",
  description: "En enkel uppvärmning för hela gruppen.",
  durationMinutes: 10,
  difficulty: "Lätt",
  muscleGroups: ["Kondition", "Rörlighet"],
  imageUrl: null,
  videoUrl: null,
  steps: ["Ställ er i en ring.", "Räck upp händerna."],
};

function renderDetail(id = EXERCISE.id) {
  return renderWithProviders(
    <Routes>
      <Route path="/exercise/:id" element={<ExerciseDetail />} />
      <Route path="/" element={<p>biblioteket</p>} />
    </Routes>,
    { route: `/exercise/${id}` },
  );
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  signedInAs();
  vi.spyOn(client, "fetchExerciseById").mockResolvedValue(EXERCISE);
});

afterEach(() => vi.restoreAllMocks());

describe("ExerciseDetail — content", () => {
  it("renders the exercise it was asked for", async () => {
    renderDetail();
    expect(
      await screen.findByRole("heading", { name: "Uppvärmning i cirkel" }),
    ).toBeInTheDocument();
    expect(client.fetchExerciseById).toHaveBeenCalledWith("e1");
  });

  it("shows duration, difficulty and every focus area", async () => {
    renderDetail();
    await screen.findByRole("heading", { name: "Uppvärmning i cirkel" });

    expect(screen.getByText("Lätt")).toBeInTheDocument();
    expect(screen.getByText("10 min")).toBeInTheDocument();
    // The card shows only the first; the detail page shows all of them.
    expect(screen.getByText("Kondition, Rörlighet")).toBeInTheDocument();
  });

  it("renders the steps as an ordered list", async () => {
    renderDetail();
    expect(await screen.findByText("Ställ er i en ring.")).toBeInTheDocument();
    // Steps arrive as a Json array, so this is real list markup rather than
    // injected HTML - no dangerouslySetInnerHTML anywhere in this page.
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("says so when instructions are missing rather than rendering a blank", async () => {
    vi.spyOn(client, "fetchExerciseById").mockResolvedValue({
      ...EXERCISE,
      steps: [],
    });
    renderDetail();
    expect(await screen.findByText("Instruktioner saknas")).toBeInTheDocument();
  });

  it("omits the duration chip when the CMS has no duration", async () => {
    vi.spyOn(client, "fetchExerciseById").mockResolvedValue({
      ...EXERCISE,
      durationMinutes: 0,
    });
    renderDetail();
    await screen.findByRole("heading", { name: "Uppvärmning i cirkel" });
    // "0 min" is worse than no chip at all.
    expect(screen.queryByText("0 min")).not.toBeInTheDocument();
  });
});

describe("ExerciseDetail — states", () => {
  it("shows a spinner while loading", () => {
    vi.spyOn(client, "fetchExerciseById").mockReturnValue(
      new Promise(() => {}),
    );
    renderDetail();
    expect(screen.getByRole("status")).toHaveAccessibleName("Laddar övning");
  });

  it("treats an unknown slug as not-found, not as a failure", async () => {
    // The adapter resolves to null for a slug that matches nothing, so this
    // must read as an ordinary missing page.
    vi.spyOn(client, "fetchExerciseById").mockResolvedValue(null);
    renderDetail("finns-inte");

    expect(
      await screen.findByRole("heading", { name: "Övningen hittades inte" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Till biblioteket" }),
    ).toHaveAttribute("href", "/");
  });

  it("distinguishes an unconfigured CMS from a real failure", async () => {
    vi.spyOn(client, "fetchExerciseById").mockRejectedValue(
      new ContentError("not_configured", "inte konfigurerad"),
    );
    renderDetail();

    expect(
      await screen.findByText("Materialet är inte publicerat ännu."),
    ).toBeInTheDocument();
  });

  it("reports a genuine failure as an error", async () => {
    vi.spyOn(client, "fetchExerciseById").mockRejectedValue(
      new ContentError("upstream_error", "trasigt"),
    );
    renderDetail();

    expect(
      await screen.findByText("Kunde inte hämta övningen. Försök igen."),
    ).toBeInTheDocument();
  });
});
