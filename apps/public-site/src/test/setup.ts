import "@testing-library/jest-dom/vitest";

// Mock IntersectionObserver for Framer Motion's whileInView in jsdom
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    private callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {}

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
