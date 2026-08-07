import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import Library from "@/pages/library";
import { renderWithProviders } from "@/test/test-utils";
import { signedInAs } from "@/test/supabase-mock";
import * as exercisesModule from "@/hooks/use-exercises";

const EXERCISES = [
  {
    id: "e1",
    title: "Uppvärmning i cirkel",
    description: "En enkel uppvärmning för hela gruppen.",
    duration: "10",
    difficulty: "Lätt",
    muscleGroups: "Hela kroppen",
  },
  {
    id: "e2",
    title: "Passningsövning",
    description: "Två och två med boll.",
    duration: "15",
    difficulty: "Medel",
    muscleGroups: "Ben",
  },
];

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
  signedInAs();
  // use-exercises is a placeholder returning [] until a backend exists, so the
  // card markup has nothing to render without stubbing it.
  vi.spyOn(exercisesModule, "useExercises").mockReturnValue({
    data: EXERCISES,
    isLoading: false,
    error: null,
  });
});

afterEach(() => vi.restoreAllMocks());

describe("Library exercise cards", () => {
  it("exposes exactly one focusable control per card", async () => {
    renderLibrary();

    const card = await screen.findByRole("article", {
      name: /Uppvärmning i cirkel/,
    });
    // The card was a <div onClick> wrapping a <button>: two overlapping click
    // targets, only one of them reachable by keyboard.
    const controls = within(card).queryAllByRole("button");
    expect(controls).toHaveLength(0);
    expect(within(card).getAllByRole("link")).toHaveLength(1);
  });

  it("names each card link distinctly", async () => {
    renderLibrary();

    // Every card's visible text is "Visa övning"; without the title the link
    // list read as a column of identical entries.
    expect(
      await screen.findByRole("link", { name: "Visa övning: Passningsövning" }),
    ).toBeInTheDocument();
  });

  it("is reachable and activatable by keyboard", async () => {
    const user = userEvent.setup();
    renderLibrary();

    const link = await screen.findByRole("link", {
      name: "Visa övning: Uppvärmning i cirkel",
    });
    link.focus();
    expect(link).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(await screen.findByText("övningsdetaljer")).toBeInTheDocument();
  });

  it("navigates to the exercise the card is for", async () => {
    renderLibrary();

    const link = await screen.findByRole("link", {
      name: "Visa övning: Passningsövning",
    });
    expect(link).toHaveAttribute("href", "/exercise/e2");
  });
});
