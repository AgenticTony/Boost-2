import { describe, it, expect } from "vitest";
import { formatDate, categoryLabels, categoryColors } from "./news-utils";

describe("formatDate", () => {
  it("formats ISO date in Swedish locale", () => {
    const result = formatDate("2025-04-15");
    expect(result).toContain("2025");
    expect(result).toContain("april");
    expect(result).toContain("15");
  });

  it("formats single-digit day", () => {
    const result = formatDate("2025-01-05");
    expect(result).toContain("5");
    expect(result).toContain("januari");
  });

  it("handles full ISO datetime strings", () => {
    const result = formatDate("2025-03-20T10:30:00Z");
    expect(result).toContain("20");
    expect(result).toContain("mars");
  });
});

describe("categoryLabels", () => {
  it("maps all expected categories", () => {
    expect(categoryLabels.alla).toBe("Alla");
    expect(categoryLabels.projekt).toBe("Projekt");
    expect(categoryLabels.resultat).toBe("Resultat");
    expect(categoryLabels.team).toBe("Team");
    expect(categoryLabels.samarbeten).toBe("Samarbeten");
  });

  it("has exactly 5 categories", () => {
    expect(Object.keys(categoryLabels)).toHaveLength(5);
  });
});

describe("categoryColors", () => {
  it("provides color classes for each content category", () => {
    expect(categoryColors.projekt).toContain("brand-navy");
    expect(categoryColors.resultat).toContain("brand-red");
  });
});
