import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/test/test-utils";
import { useNewsBySlug } from "./use-news-by-slug";

describe("useNewsBySlug", () => {
  it("is disabled when slug is undefined", () => {
    const { result } = renderHook(() => useNewsBySlug(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("returns article when slug matches", async () => {
    const { result } = renderHook(
      () => useNewsBySlug("nytt-samarbete-med-malmo-stad"),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).not.toBeNull();
    expect(result.current.data?.slug).toBe("nytt-samarbete-med-malmo-stad");
    expect(result.current.data?.title).toContain("Malmö stad");
  });

  it("returns null data when slug does not exist", async () => {
    const { result } = renderHook(() => useNewsBySlug("nonexistent-article"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });

  it("uses slug in query key", async () => {
    const { result } = renderHook(
      () => useNewsBySlug("200-deltagare-fick-jobb-2024"),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.id).toBe("2");
  });
});
