import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import type { Resource } from "@/types";
import ResurserPage from "./resurser";

vi.mock("@/hooks/use-resources", () => ({ useResources: vi.fn() }));

import { useResources } from "@/hooks/use-resources";
const mockUseResources = vi.mocked(useResources);

function renderPage(initialEntry = "/resurser") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <ResurserPage />
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Metodguide",
    slug: "metodguide",
    category: "normer",
    description: "En guide för inkludering.",
    fileUrl: "https://files.example.com/guide.pdf",
    fileName: "guide.pdf",
    fileSize: 2048,
    fileType: "pdf",
    isPublic: true,
  },
];

describe("ResurserPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseResources.mockReturnValue({
      data: resources,
      isLoading: false,
      error: null,
    } as never);
  });

  it("renders the hero heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", {
        name: /Verktyg för ett mer inkluderande arbetsliv/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders a download link for a resource with an http fileUrl", () => {
    renderPage();
    const download = screen.getByRole("link", { name: /Ladda ner/i });
    expect(download).toHaveAttribute(
      "href",
      "https://files.example.com/guide.pdf",
    );
    expect(screen.getByText("pdf")).toBeInTheDocument();
  });

  it("marks the default 'alla' filter as pressed", () => {
    renderPage();
    const alla = screen.getByRole("button", { name: /Alla/i });
    expect(alla).toHaveAttribute("aria-pressed", "true");
  });

  it("shows loading skeletons while loading", () => {
    mockUseResources.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as never);
    const { container } = renderPage();
    expect(screen.queryByText(/Metodguide/i)).not.toBeInTheDocument();
    expect(container.querySelector('section[aria-busy="true"]')).toBeTruthy();
  });

  it("shows an error message when the fetch fails", () => {
    mockUseResources.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("boom"),
    } as never);
    renderPage();
    expect(screen.getByText(/Kunde inte ladda resurser/i)).toBeInTheDocument();
  });

  it("shows an empty state when there are no resources", () => {
    mockUseResources.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as never);
    renderPage();
    expect(
      screen.getByText(/Inga resurser att visa just nu/i),
    ).toBeInTheDocument();
  });
});
