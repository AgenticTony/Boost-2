import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import { ScrollToTop } from "./scroll-to-top";

/** Harness: ScrollToTop plus a link to trigger navigation with. */
function Harness() {
  return (
    <>
      <ScrollToTop />
      <Link to="/next">go to next page</Link>
      <Routes>
        <Route path="/" element={<p>home</p>} />
        <Route path="/next" element={<p>next</p>} />
      </Routes>
    </>
  );
}

describe("ScrollToTop", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resets scroll to the top when navigating to a new route", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Harness />
      </MemoryRouter>,
    );

    // Discard the initial-mount scroll call so we assert on the navigation event.
    vi.mocked(window.scrollTo).mockClear();

    await userEvent.click(screen.getByText("go to next page"));

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("scrolls to the top on initial mount", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Harness />
      </MemoryRouter>,
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("does not throw and renders nothing", () => {
    const { container } = render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
