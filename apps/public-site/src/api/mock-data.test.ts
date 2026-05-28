import { describe, it, expect } from "vitest";
import { mockNewsArticles, mockTimeline, mockResources } from "./mock-data";

describe("mock-data", () => {
  describe("mockNewsArticles", () => {
    it("has unique ids", () => {
      const ids = mockNewsArticles.map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("has unique slugs", () => {
      const slugs = mockNewsArticles.map((a) => a.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("all slugs are URL-safe", () => {
      for (const a of mockNewsArticles) {
        expect(a.slug).toMatch(/^[a-z0-9-]+$/);
      }
    });

    it("has valid publishedAt dates", () => {
      for (const a of mockNewsArticles) {
        const date = new Date(a.publishedAt);
        expect(date.getTime()).not.toBeNaN();
      }
    });

    it("all categories are from known set", () => {
      const validCategories = ["projekt", "resultat", "team", "samarbeten"];
      for (const a of mockNewsArticles) {
        expect(validCategories).toContain(a.category);
      }
    });
  });

  describe("mockTimeline", () => {
    it("has unique ids", () => {
      const ids = mockTimeline.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("years are reasonable (2000–2030)", () => {
      for (const e of mockTimeline) {
        expect(e.year).toBeGreaterThanOrEqual(2000);
        expect(e.year).toBeLessThanOrEqual(2030);
      }
    });

    it("entries are sorted by year ascending", () => {
      for (let i = 1; i < mockTimeline.length; i++) {
        expect(mockTimeline[i].year).toBeGreaterThanOrEqual(
          mockTimeline[i - 1].year,
        );
      }
    });
  });

  describe("mockResources", () => {
    it("has unique ids", () => {
      const ids = mockResources.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("has unique slugs", () => {
      const slugs = mockResources.map((r) => r.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("all slugs are URL-safe", () => {
      for (const r of mockResources) {
        expect(r.slug).toMatch(/^[a-z0-9-]+$/);
      }
    });

    it("has fileSize when fileType is present", () => {
      for (const r of mockResources) {
        if (r.fileType) {
          expect(r.fileSize).toBeDefined();
          expect(r.fileSize).toBeGreaterThan(0);
        }
      }
    });

    it("all categories are from known set", () => {
      const validCategories = [
        "arbetsmarknad",
        "normer",
        "halsa",
        "handbocker",
      ];
      for (const r of mockResources) {
        expect(validCategories).toContain(r.category);
      }
    });
  });
});
