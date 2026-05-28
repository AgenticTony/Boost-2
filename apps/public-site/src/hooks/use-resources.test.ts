import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/test/test-utils";
import { useResources } from "./use-resources";
import { mockResources } from "@/api/mock-data";

describe("useResources", () => {
  it("returns all resources for 'alla' category", async () => {
    const { result } = renderHook(() => useResources("alla"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResources);
  });

  it("filters by specific category", async () => {
    const { result } = renderHook(() => useResources("arbetsmarknad"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data!.length).toBeGreaterThanOrEqual(1);
    for (const r of result.current.data!) {
      expect(r.category).toBe("arbetsmarknad");
    }
  });

  it("returns empty array for unknown category", async () => {
    const { result } = renderHook(() => useResources("nonexistent"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it("starts in loading state", () => {
    const { result } = renderHook(() => useResources("alla"), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });
});
