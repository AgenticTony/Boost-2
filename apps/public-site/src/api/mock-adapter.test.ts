import { describe, it, expect, vi } from "vitest";
import { createMockAdapter } from "./mock-adapter";
import { mockNewsArticles, mockTimeline, mockResources } from "./mock-data";

describe("mock-adapter", () => {
  const adapter = createMockAdapter();

  describe("fetchNews", () => {
    it("returns all mock news articles", async () => {
      const news = await adapter.fetchNews();
      expect(news).toEqual(mockNewsArticles);
      expect(news.length).toBeGreaterThanOrEqual(4);
    });

    it("each article has required fields", async () => {
      const news = await adapter.fetchNews();
      for (const article of news) {
        expect(article).toHaveProperty("id");
        expect(article).toHaveProperty("slug");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("publishedAt");
        expect(article).toHaveProperty("category");
        expect(article).toHaveProperty("excerpt");
        expect(article).toHaveProperty("body");
      }
    });
  });

  describe("fetchNewsBySlug", () => {
    it("returns matching article", async () => {
      const article = await adapter.fetchNewsBySlug(
        "200-deltagare-fick-jobb-2024",
      );
      expect(article).not.toBeNull();
      expect(article?.id).toBe("2");
    });

    it("returns null for unknown slug", async () => {
      const article = await adapter.fetchNewsBySlug("does-not-exist");
      expect(article).toBeNull();
    });
  });

  describe("fetchTimeline", () => {
    it("returns all timeline entries", async () => {
      const timeline = await adapter.fetchTimeline();
      expect(timeline).toEqual(mockTimeline);
      expect(timeline.length).toBeGreaterThanOrEqual(8);
    });

    it("entries are chronologically ordered", async () => {
      const timeline = await adapter.fetchTimeline();
      const years = timeline.map((e) => e.year);
      for (let i = 1; i < years.length; i++) {
        expect(years[i]).toBeGreaterThanOrEqual(years[i - 1]);
      }
    });
  });

  describe("fetchResources", () => {
    it("returns all resources", async () => {
      const resources = await adapter.fetchResources();
      expect(resources).toEqual(mockResources);
      expect(resources.length).toBeGreaterThanOrEqual(6);
    });

    it("all resources are public", async () => {
      const resources = await adapter.fetchResources();
      for (const r of resources) {
        expect(r.isPublic).toBe(true);
      }
    });
  });

  describe("fetchResourcesByCategory", () => {
    it("returns all resources for 'alla'", async () => {
      const resources = await adapter.fetchResourcesByCategory("alla");
      expect(resources).toEqual(mockResources);
    });

    it("filters by specific category", async () => {
      const resources = await adapter.fetchResourcesByCategory("arbetsmarknad");
      expect(resources.length).toBeGreaterThanOrEqual(1);
      for (const r of resources) {
        expect(r.category).toBe("arbetsmarknad");
      }
    });

    it("returns empty array for unknown category", async () => {
      const resources = await adapter.fetchResourcesByCategory("nonexistent");
      expect(resources).toEqual([]);
    });
  });

  describe("submitRegistration", () => {
    it("returns success", async () => {
      const result = await adapter.submitRegistration({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "070-1234567",
        track: "arbetssparet",
      });
      expect(result).toEqual({ success: true, delivered: false });
    });
  });

  describe("submitContact", () => {
    it("POSTs to VITE_CONTACT_WORKER_URL and reports delivered on success", async () => {
      vi.stubEnv("VITE_CONTACT_WORKER_URL", "https://worker.test/submit");
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, id: "abc" }),
      });
      vi.stubGlobal("fetch", fetchMock);

      const result = await adapter.submitContact({
        name: "Test User",
        email: "test@example.com",
        subject: "Question",
        message: "Hello!",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://worker.test/submit",
        expect.objectContaining({ method: "POST" }),
      );
      expect(result).toEqual({ success: true, delivered: true });

      vi.unstubAllGlobals();
      vi.unstubAllEnvs();
    });

    it("falls back to the deployed worker when VITE_CONTACT_WORKER_URL is unset", async () => {
      vi.stubEnv("VITE_CONTACT_WORKER_URL", "");
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, id: "abc" }),
      });
      vi.stubGlobal("fetch", fetchMock);

      const result = await adapter.submitContact({
        name: "Test User",
        email: "test@example.com",
        subject: "Question",
        message: "Hello!",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://contact-worker.moh17670s.workers.dev",
        expect.objectContaining({ method: "POST" }),
      );
      expect(result).toEqual({ success: true, delivered: true });

      vi.unstubAllGlobals();
      vi.unstubAllEnvs();
    });

    it("reports not delivered when the worker call fails", async () => {
      vi.stubEnv("VITE_CONTACT_WORKER_URL", "https://worker.test/submit");
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
      const result = await adapter.submitContact({
        name: "Test User",
        email: "test@example.com",
        subject: "Question",
        message: "Hello!",
      });
      expect(result).toEqual({ success: false, delivered: false });
      vi.unstubAllGlobals();
      vi.unstubAllEnvs();
    });
  });
});
