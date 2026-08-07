import "@testing-library/jest-dom/vitest";
import { vi, beforeEach } from "vitest";

// Mock IntersectionObserver for Framer Motion's whileInView in jsdom
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly scrollMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  // Not a parameter property: `erasableSyntaxOnly` forbids that syntax.
  private callback: IntersectionObserverCallback;

  constructor(
    callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
  }

  observe() {
    // Immediately trigger as intersecting so ScrollReveal renders children
    this.callback(
      [
        {
          isIntersecting: true,
          target: document.body,
          intersectionRatio: 1,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        },
      ],
      this,
    );
    return this;
  }

  unobserve() {
    return this;
  }

  disconnect() {
    return this;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

// jsdom does not implement window.scrollTo — stub it so route-change scroll
// resets (ScrollToTop) don't log "Not implemented" warnings during tests.
window.scrollTo = () => {};

// Replace the Supabase client everywhere, for every test file.
//
// `@/lib/supabase` calls createClient() at module load and throws when its env
// vars are missing, so any test that transitively imports auth would fail at
// collection. Mocking it here rather than per-file also guarantees no test can
// accidentally reach the network.
vi.mock("@/lib/supabase", async () => {
  const { supabaseMock } = await import("@/test/supabase-mock");
  return { supabase: supabaseMock.client };
});

// Each test starts from a clean auth/query state.
beforeEach(async () => {
  const { supabaseMock } = await import("@/test/supabase-mock");
  supabaseMock.reset();
});
