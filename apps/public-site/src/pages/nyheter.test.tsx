import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import type { NewsArticle } from "@/types";
import NyheterPage from "./nyheter";

vi.mock("@/hooks/use-news", () => ({ useNews: vi.fn() }));

import { useNews } from "@/hooks/use-news";
const mockUseNews = vi.mocked(useNews);

function renderPage(initialEntry = "/nyheter") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <NyheterPage />
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

const articles: NewsArticle[] = [
  {
    id: "1",
    slug: "projekt-ett",
    title: "Projektnyhet",
    publishedAt: "2026-03-01T00:00:00Z",
    category: "projekt",
    excerpt: "Ett projekt",
    body: "",
  },
  {
    id: "2",
    slug: "resultat-ett",
    title: "Resultatnyhet",
    publishedAt: "2026-02-01T00:00:00Z",
    category: "resultat",
    excerpt: "Ett resultat",
    body: "",
  },
];

describe("NyheterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNews.mockReturnValue({
      data: articles,
      isLoading: false,
      error: null,
    } as never);
  });

  it("renders the hero heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: /Nyheter och uppdateringar/i }),
    ).toBeInTheDocument();
  });

  it("renders a filter button per category", () => {
    renderPage();
    for (const label of ["Alla", "Projekt", "Resultat", "Team", "Samarbeten"]) {
      expect(
        screen.getByRole("button", { name: new RegExp(`^${label}$`) }),
      ).toBeInTheDocument();
    }
  });

  it("renders an article card per article with a link to the slug", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /Projektnyhet/i })).toHaveAttribute(
      "href",
      "/nyheter/projekt-ett",
    );
    expect(screen.getAllByText(/Läs mer/i).length).toBeGreaterThanOrEqual(2);
  });

  it("shows loading skeletons while loading", () => {
    mockUseNews.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as never);
    const { container } = renderPage();
    expect(screen.queryByText(/Projektnyhet/i)).not.toBeInTheDocument();
    expect(container.querySelector('section[aria-busy="true"]')).toBeTruthy();
  });

  it("shows an error message when the fetch fails", () => {
    mockUseNews.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("boom"),
    } as never);
    renderPage();
    expect(screen.getByText(/Kunde inte ladda nyheter/i)).toBeInTheDocument();
  });

  it("shows an empty state when there are no articles", () => {
    mockUseNews.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as never);
    renderPage();
    expect(
      screen.getByText(/Inga nyheter att visa just nu/i),
    ).toBeInTheDocument();
  });

  it("filters to a single category from the URL search params", () => {
    renderPage("/nyheter?kategori=projekt");
    expect(screen.getByText(/Projektnyhet/i)).toBeInTheDocument();
    expect(screen.queryByText(/Resultatnyhet/i)).not.toBeInTheDocument();
  });
});
