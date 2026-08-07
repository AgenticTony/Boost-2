import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import Library from "@/pages/library";
import { renderWithProviders } from "@/test/test-utils";
import { signedInAs } from "@/test/supabase-mock";
import { ContentError } from "@/api/adapter";
import type { Exercise } from "@/types/exercise";
import * as client from "@/api/client";

const EXERCISES: Exercise[] = [
  {
    id: "e1",
    title: "Uppvärmning i cirkel",
    description: "En enkel uppvärmning för hela gruppen.",
    durationMinutes: 10,
    difficulty: "Lätt",
    muscleGroups: ["Hela kroppen"],
    videoUrl: null,
    imageUrl: null,
  },
  {
    id: "e2",
    title: "Passningsövning",
    description: "Två och två med boll.",
    durationMinutes: 15,
    difficulty: "Medel",
    muscleGroups: ["Teknik", "Samarbete"],
    videoUrl: null,
    imageUrl: null,
  },
];

/**
 * Mocks the API client rather than the hook, so the react-query wiring, the
 * loading and error states and the cache key all run for real. Mocking
 * `useExercises` would assert on a stub of the thing under test.
 */
function renderLibrary() {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<Library />} />
      <Route path="/exercise/:id" element={<p>övningsdetaljer</p>} />
    </Routes>,
  );
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  signedInAs();
  vi.spyOn(client, "fetchExercises").mockResolvedValue(EXERCISES);
});

afterEach(() => vi.restoreAllMocks());

describe("Library — cards", () => {
  it("renders one card per exercise", async () => {
    renderLibrary();
    expect(
      await screen.findByRole("article", { name: /Uppvärmning i cirkel/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("exposes exactly one focusable control per card", async () => {
    renderLibrary();
    const card = await screen.findByRole("article", {
      name: /Uppvärmning i cirkel/,
    });
    // The card was a <div onClick> wrapping a <button>: two overlapping click
    // targets, only one of them reachable by keyboard.
    expect(within(card).queryAllByRole("button")).toHaveLength(0);
    expect(within(card).getAllByRole("link")).toHaveLength(1);
  });

  it("links by document id (the model has no slug)", async () => {
    renderLibrary();
    const link = await screen.findByRole("link", {
      name: "Visa övning: Passningsövning",
    });
    expect(link).toHaveAttribute("href", "/exercise/e2");
  });

  it("is activatable by keyboard", async () => {
    const user = userEvent.setup();
    renderLibrary();

    const link = await screen.findByRole("link", {
      name: "Visa övning: Uppvärmning i cirkel",
    });
    link.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("övningsdetaljer")).toBeInTheDocument();
  });

  it("shows duration and the first focus area", async () => {
    renderLibrary();
    const card = await screen.findByRole("article", {
      name: /Passningsövning/,
    });
    expect(within(card).getByText("15 min")).toBeInTheDocument();
    expect(within(card).getByText("Teknik")).toBeInTheDocument();
  });
});

describe("Library — search and filter", () => {
  it("searches across muscle groups, not just titles", async () => {
    const user = userEvent.setup();
    renderLibrary();
    await screen.findByRole("article", { name: /Uppvärmning/ });

    await user.type(screen.getByLabelText("Sök övningar"), "samarbete");

    // Matches e2 via muscleGroups, which Hygraph stores comma-separated and
    // the mapper splits into an array.
    expect(
      screen.getByRole("article", { name: /Passningsövning/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("article", { name: /Uppvärmning/ }),
    ).not.toBeInTheDocument();
  });

  it("filters by difficulty", async () => {
    const user = userEvent.setup();
    renderLibrary();
    await screen.findByRole("article", { name: /Uppvärmning/ });

    await user.click(screen.getByRole("button", { name: "Svår" }));
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText("Inga övningar hittades")).toBeInTheDocument();
  });
});

describe("Library — states", () => {
  it("shows a spinner while loading", () => {
    vi.spyOn(client, "fetchExercises").mockReturnValue(new Promise(() => {}));
    renderLibrary();
    expect(screen.getByRole("status")).toHaveAccessibleName("Laddar övningar");
  });

  it("distinguishes an unconfigured CMS from a real failure", async () => {
    vi.spyOn(client, "fetchExercises").mockRejectedValue(
      new ContentError(
        "not_configured",
        "Innehållskällan är inte konfigurerad ännu.",
      ),
    );
    renderLibrary();

    // "Nobody has published yet" is not an error worth reporting to support.
    expect(
      await screen.findByText("Inga övningar publicerade ännu"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Kunde inte ladda övningar"),
    ).not.toBeInTheDocument();
  });

  it("reports a genuine fetch failure as an error", async () => {
    vi.spyOn(client, "fetchExercises").mockRejectedValue(
      new ContentError("upstream_error", "Kunde inte hämta innehållet."),
    );
    renderLibrary();

    expect(
      await screen.findByText("Kunde inte ladda övningar"),
    ).toBeInTheDocument();
  });

  it("shows an empty state when the CMS returns nothing", async () => {
    vi.spyOn(client, "fetchExercises").mockResolvedValue([]);
    renderLibrary();

    await waitFor(() =>
      expect(screen.getByText("Inga övningar hittades")).toBeInTheDocument(),
    );
    expect(screen.getByText("0 övningar")).toBeInTheDocument();
  });
});
