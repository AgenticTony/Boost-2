import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import NotFoundPage from "./not-found";

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("NotFoundPage", () => {
  it("renders the 404 heading and a way back", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: /Sidan hittades inte/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Tillbaka till startsidan/i }),
    ).toHaveAttribute("href", "/");
  });

  it("is marked noindex", () => {
    // Cloudflare Pages serves the SPA shell with HTTP 200 for every unmatched
    // path, so this page is a soft 404 - without the robots tag Google indexes
    // arbitrary junk URLs as real pages.
    renderPage();

    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute("content")).toBe("noindex, follow");
  });

  it("does not set a canonical URL", () => {
    // A canonical on a 404 would assert the junk URL is a legitimate page.
    renderPage();

    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });
});
