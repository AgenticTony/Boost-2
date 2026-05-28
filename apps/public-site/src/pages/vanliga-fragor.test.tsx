import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import VanligaFragorPage from "./vanliga-fragor";

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <VanligaFragorPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("VanligaFragorPage (FAQ)", () => {
  it("actually renders what useSeo returns", () => {
    // useSeo returns <Helmet> JSX rather than side-effecting. Calling it bare -
    // the pattern this page used to follow - silently dropped every tag, so no
    // page emitted a canonical, per-page title or JSON-LD. Guard against a
    // regression: assert the tags reach the DOM, not just that useSeo is called.
    renderPage();

    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://boostbyfcr.se/vanliga-fragor");
    expect(document.title).toContain("Vanliga frågor");
    expect(
      document.querySelectorAll('script[type="application/ld+json"]').length,
    ).toBeGreaterThan(0);
  });

  it("renders the hero heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: /^Vanliga frågor$/i }),
    ).toBeInTheDocument();
  });

  it("renders all three FAQ section headings", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Om Boost" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Arbete & studier" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Praktiskt" }),
    ).toBeInTheDocument();
  });

  it("renders questions as accordion triggers", () => {
    renderPage();
    expect(
      screen.getByRole("button", {
        name: /Vad är Boost by FC Rosengård\?/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Hur anmäler jag mig\?/i }),
    ).toBeInTheDocument();
  });

  it("links to contact and registration from the bottom CTA", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /Kontakta oss/i })).toHaveAttribute(
      "href",
      "/kontakt",
    );
    expect(screen.getByRole("link", { name: /Anmäl dig/i })).toHaveAttribute(
      "href",
      "/anmal-dig2",
    );
  });
});
