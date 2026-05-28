import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/test/test-utils";
import { useNews } from "./use-news";
import { useNewsBySlug } from "./use-news-by-slug";
import { useResources } from "./use-resources";
import { useTimeline } from "./use-timeline";

// Mock the data layer so the hooks can be driven into an error state — the
// real mock adapter always resolves, so the error path is otherwise untested.
vi.mock("@/api/client", () => ({
  fetchNews: vi.fn(),
  fetchNewsBySlug: vi.fn(),
  fetchTimeline: vi.fn(),
  fetchResources: vi.fn(),
  fetchResourcesByCategory: vi.fn(),
}));

import * as api from "@/api/client";

describe("data hooks — error state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useNews surfaces isError when fetchNews rejects", async () => {
    vi.mocked(api.fetchNews).mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useNews(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("useNewsBySlug surfaces isError when fetchNewsBySlug rejects", async () => {
    vi.mocked(api.fetchNewsBySlug).mockRejectedValue(new Error("not found"));
    const { result } = renderHook(() => useNewsBySlug("some-slug"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("useResources surfaces isError when the fetch rejects", async () => {
    vi.mocked(api.fetchResources).mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useResources("alla"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("useTimeline surfaces isError when fetchTimeline rejects", async () => {
    vi.mocked(api.fetchTimeline).mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useTimeline(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
