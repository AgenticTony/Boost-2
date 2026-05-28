import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createResilientAdapter } from "./client";
import type { ApiAdapter } from "./adapter";

/**
 * Minimal adapter stubs. The resilient wrapper only cares about WHICH adapter
 * ran, not the data shape, so returns are loosely cast.
 */
function fakeAdapter(overrides: Partial<ApiAdapter> = {}): ApiAdapter {
  return {
    fetchNews: async () => [],
    fetchNewsBySlug: async () => null,
    fetchTimeline: async () => [],
    fetchResources: async () => [],
    fetchResourcesByCategory: async () => [],
    submitRegistration: async () => ({ success: true }),
    submitContact: async () => ({ success: true }),
    ...overrides,
  };
}

describe("createResilientAdapter", () => {
  it("returns primary data when the primary succeeds", async () => {
    const primary = fakeAdapter({
      fetchNews: async () => [{ id: "from-primary" }] as never,
    });
    const fallback = fakeAdapter({
      fetchNews: async () => [{ id: "from-fallback" }] as never,
    });

    const result = await createResilientAdapter(primary, fallback).fetchNews();
    expect(result).toEqual([{ id: "from-primary" }]);
  });

  it("falls back to the fallback adapter and warns when the primary throws", async () => {
    const primary = fakeAdapter({
      fetchNews: async () => {
        throw new Error("network down");
      },
    });
    const fallback = fakeAdapter({
      fetchNews: async () => [{ id: "from-fallback" }] as never,
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await createResilientAdapter(primary, fallback).fetchNews();

    expect(result).toEqual([{ id: "from-fallback" }]);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("passes arguments through to the fallback", async () => {
    const primary = fakeAdapter({
      fetchNewsBySlug: async () => {
        throw new Error("boom");
      },
    });
    const fallback = fakeAdapter({
      fetchNewsBySlug: async (slug) => ({ id: slug }) as never,
    });
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await createResilientAdapter(
      primary,
      fallback,
    ).fetchNewsBySlug("my-slug");

    expect(result).toEqual({ id: "my-slug" });
    vi.restoreAllMocks();
  });

  it("does not fall back for form submissions — passes through to primary", async () => {
    const submitRegistration = vi
      .fn()
      .mockResolvedValue({ success: true, delivered: false });
    const primary = fakeAdapter({ submitRegistration });
    const fallbackSubmit = vi.fn();
    const fallback = fakeAdapter({ submitRegistration: fallbackSubmit });

    await createResilientAdapter(primary, fallback).submitRegistration(
      {} as never,
    );

    expect(submitRegistration).toHaveBeenCalledTimes(1);
    expect(fallbackSubmit).not.toHaveBeenCalled();
  });

  it("falls back for fetchTimeline when the primary throws", async () => {
    const primary = fakeAdapter({
      fetchTimeline: async () => {
        throw new Error("hygraph down");
      },
    });
    const fallback = fakeAdapter({
      fetchTimeline: async () => [{ id: "tl-fallback" }] as never,
    });
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await createResilientAdapter(
      primary,
      fallback,
    ).fetchTimeline();

    expect(result).toEqual([{ id: "tl-fallback" }]);
    vi.restoreAllMocks();
  });

  it("falls back for fetchResources when the primary throws", async () => {
    const primary = fakeAdapter({
      fetchResources: async () => {
        throw new Error("hygraph down");
      },
    });
    const fallback = fakeAdapter({
      fetchResources: async () => [{ id: "res-fallback" }] as never,
    });
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await createResilientAdapter(
      primary,
      fallback,
    ).fetchResources();

    expect(result).toEqual([{ id: "res-fallback" }]);
    vi.restoreAllMocks();
  });

  it("falls back for fetchResourcesByCategory and forwards the category", async () => {
    const primary = fakeAdapter({
      fetchResourcesByCategory: async () => {
        throw new Error("hygraph down");
      },
    });
    const fallback = fakeAdapter({
      fetchResourcesByCategory: async (category) =>
        [{ id: `cat-${category}` }] as never,
    });
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await createResilientAdapter(
      primary,
      fallback,
    ).fetchResourcesByCategory("normer");

    expect(result).toEqual([{ id: "cat-normer" }]);
    vi.restoreAllMocks();
  });

  it("does not fall back for submitContact — passes through to primary", async () => {
    const submitContact = vi
      .fn()
      .mockResolvedValue({ success: true, delivered: false });
    const primary = fakeAdapter({ submitContact });
    const fallbackSubmit = vi.fn();
    const fallback = fakeAdapter({ submitContact: fallbackSubmit });

    await createResilientAdapter(primary, fallback).submitContact({} as never);

    expect(submitContact).toHaveBeenCalledTimes(1);
    expect(fallbackSubmit).not.toHaveBeenCalled();
  });
});

/**
 * Module-init config branches: which adapter the singleton selects based on
 * env. These guard the P2 hardening promise that a misconfigured Hygraph setup
 * never breaks the site — it degrades to mock data.
 */
describe("adapter selection (module init)", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("uses the mock adapter when VITE_USE_HYGRAPH is not 'true'", async () => {
    vi.stubEnv("VITE_USE_HYGRAPH", "false");
    const { fetchNews } = await import("./client");

    // Mock adapter resolves synchronously-ish with an array, no network call.
    const result = await fetchNews();
    expect(Array.isArray(result)).toBe(true);
  });

  it("warns and uses mock when Hygraph is enabled but the endpoint is unset", async () => {
    vi.stubEnv("VITE_USE_HYGRAPH", "true");
    vi.stubEnv("VITE_HYGRAPH_ENDPOINT", "");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { fetchNews } = await import("./client");

    const result = await fetchNews();

    expect(Array.isArray(result)).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("VITE_HYGRAPH_ENDPOINT is empty"),
    );
  });

  it("constructs the resilient adapter when Hygraph is enabled and an endpoint is set", async () => {
    vi.stubEnv("VITE_USE_HYGRAPH", "true");
    vi.stubEnv("VITE_HYGRAPH_ENDPOINT", "https://example.hygraph.com/graphql");
    vi.stubEnv("VITE_HYGRAPH_TOKEN", "test-token");

    // Importing executes the IIFE; construction must not throw and must not
    // make a network call (GraphQLClient only stores config at construction).
    await expect(import("./client")).resolves.toBeDefined();
  });
});
