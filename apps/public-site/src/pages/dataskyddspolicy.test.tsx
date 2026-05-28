import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import DataskyddspolicyPage from "./dataskyddspolicy";

function renderPage() {
  return render(
    <HelmetProvider>
      <DataskyddspolicyPage />
    </HelmetProvider>,
  );
}

describe("DataskyddspolicyPage (Privacy)", () => {
  it("renders the hero heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: /^Dataskyddspolicy$/i }),
    ).toBeInTheDocument();
  });

  it("exposes the data-protection contact email", () => {
    renderPage();
    const mailto = screen.getAllByText(/dataskydd@boostbyfcr\.se/i);
    expect(mailto.length).toBeGreaterThanOrEqual(1);
    const link = mailto[0].closest("a");
    expect(link).toHaveAttribute("href", "mailto:dataskydd@boostbyfcr.se");
  });

  it("renders the numbered policy sections", () => {
    renderPage();
    expect(
      screen.getByRole("heading", {
        name: /1\. Vilken information samlar vi in\?/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /6\. Vilka är mina rättigheter\?/i,
      }),
    ).toBeInTheDocument();
  });

  it("states it will not sell personal data", () => {
    renderPage();
    expect(
      screen.getByText(/kommer inte att sälja dina personuppgifter/i),
    ).toBeInTheDocument();
  });
});
