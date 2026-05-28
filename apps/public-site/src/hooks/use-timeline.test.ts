import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/test/test-utils";
import { useTimeline } from "./use-timeline";
import { mockTimeline } from "@/api/mock-data";

describe("useTimeline", () => {
  it("returns all timeline entries", async () => {
    const { result } = renderHook(() => useTimeline(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTimeline);
    expect(result.current.data!.length).toBeGreaterThanOrEqual(8);
  });

  it("entries have required fields", async () => {
    const { result } = renderHook(() => useTimeline(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const entry = result.current.data![0];
    expect(entry).toHaveProperty("id");
    expect(entry).toHaveProperty("year");
    expect(entry).toHaveProperty("projectName");
    expect(entry).toHaveProperty("description");
  });

  it("starts in loading state", () => {
    const { result } = renderHook(() => useTimeline(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });
});
