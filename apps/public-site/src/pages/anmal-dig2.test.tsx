import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import AnmalDig2Page from "./anmal-dig2";

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnmalDig2Page />
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

describe("AnmalDig2Page (Anmälan → embedded Google Form iframe)", () => {
  beforeEach(() => {
    // /anmal-dig2 does not fetch slots, but the layout is harmless without it.
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("holds the Google embed back until the visitor consents", () => {
    // Loading it on sight contacts seven Google hosts before anyone agrees to
    // anything. Hiding the iframe would not help - it must not be built.
    renderPage();

    expect(
      screen.queryByTitle(/Anmälan till Bridge by FC Rosengård/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Formuläret laddas från Google/i }),
    ).toBeInTheDocument();
  });

  it("renders the Google Form iframe with the embedded=true URL once consented", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /Öppna formuläret/i }));

    const iframe = (await screen.findByTitle(
      /Anmälan till Bridge by FC Rosengård/i,
    )) as HTMLIFrameElement;
    expect(iframe.src).toContain("docs.google.com/forms");
    expect(iframe.src).toContain("embedded=true");
  });

  it("offers phone and email for anyone who would rather not use Google", () => {
    renderPage();

    expect(screen.getByRole("link", { name: /070-992 17 66/ })).toHaveAttribute(
      "href",
      "tel:+46709921766",
    );
  });

  it("keeps the shared page chrome (hero + steps heading)", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: /Ta första steget/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Vad händer sen/i }),
    ).toBeInTheDocument();
  });
});
