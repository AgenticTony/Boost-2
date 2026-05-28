import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsSection } from "./stats-section";

describe("StatsSection", () => {
  it("renders the section heading", () => {
    render(<StatsSection />);
    expect(
      screen.getByRole("heading", {
        name: /Så här mycket har vi hunnit/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the founding year as 2003 — not formatted with a thousands space", () => {
    const { container } = render(<StatsSection />);
    // A year is not a quantity: it must render as "2003", never "2 003"
    // (sv-SE locale inserts a space thousands separator for numbers >= 1000).
    expect(screen.getByText("2003")).toBeInTheDocument();
    expect(container.textContent).not.toContain("2 003");
  });

  it("renders each stat label", () => {
    render(<StatsSection />);
    expect(screen.getByText("Unga som varit hos oss")).toBeInTheDocument();
    expect(screen.getByText("Fått arbete eller studier")).toBeInTheDocument();
    expect(screen.getByText("Nöjda deltagare")).toBeInTheDocument();
    expect(screen.getByText("Sedan starten")).toBeInTheDocument();
  });
});
