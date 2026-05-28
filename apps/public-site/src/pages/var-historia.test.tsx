import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import type { TimelineEntry } from "@/types";
import VarHistoriaPage from "./var-historia";

vi.mock("@/hooks/use-timeline", () => ({ useTimeline: vi.fn() }));

import { useTimeline } from "@/hooks/use-timeline";
const mockUseTimeline = vi.mocked(useTimeline);

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <VarHistoriaPage />
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

const timeline: TimelineEntry[] = [
  {
    id: "1",
    year: 2003,
    projectName: "Starten",
    description: "Det började i Rosengård.",
    funder: "Allmänna Arvsfonden",
  },
  {
    id: "2",
    year: 2010,
    projectName: "Tillväxt",
    description: "Vi växte.",
  },
];

describe("VarHistoriaPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTimeline.mockReturnValue({
      data: timeline,
      isLoading: false,
      error: null,
    } as never);
  });

  it("renders the hero heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", {
        name: /Vi har funnits sedan 2003/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders each timeline entry with year, project name and funder", () => {
    renderPage();
    expect(screen.getByText("Starten")).toBeInTheDocument();
    expect(screen.getByText(/Det började i Rosengård/i)).toBeInTheDocument();
    expect(screen.getByText("Allmänna Arvsfonden")).toBeInTheDocument();
    expect(screen.getByText("Tillväxt")).toBeInTheDocument();
  });

  it("shows a loading message while loading", () => {
    mockUseTimeline.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as never);
    renderPage();
    expect(screen.getByText(/Laddar tidslinje/i)).toBeInTheDocument();
  });

  it("shows an error message when the fetch fails", () => {
    mockUseTimeline.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("boom"),
    } as never);
    renderPage();
    expect(
      screen.getByText(/Kunde inte ladda tidslinjen/i),
    ).toBeInTheDocument();
  });

  it("links to the registration page from the bottom CTA", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /Anmäl dig/i })).toHaveAttribute(
      "href",
      "/anmal-dig2",
    );
  });
});
