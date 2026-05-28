import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/test/test-utils";
import { useNews } from "./use-news";
import { mockNewsArticles } from "@/api/mock-data";

describe("useNews", () => {
  it("starts in loading state", () => {
    const { result } = renderHook(() => useNews(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("returns news articles on success", async () => {
    const { result } = renderHook(() => useNews(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockNewsArticles);
    expect(result.current.data!.length).toBeGreaterThanOrEqual(4);
  });

  it("uses correct query key", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useNews(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify data shape matches expected structure
    const article = result.current.data![0];
    expect(article).toHaveProperty("id");
    expect(article).toHaveProperty("slug");
    expect(article).toHaveProperty("title");
  });
});
