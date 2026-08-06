import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/error-boundary";

function ThrowOnRender() {
  throw new Error("Test error");
}

// All ErrorBoundary tests need a Router because the fallback renders a <Link>
function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    renderWithRouter(
      <ErrorBoundary>
        <p>Safe content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Safe content")).toBeInTheDocument();
  });

  it("renders fallback UI on error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithRouter(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Något gick fel")).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it("renders retry button on error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithRouter(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Försök igen")).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it("renders link to home on error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithRouter(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>,
    );

    const link = screen.getByText("Till startsidan");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/");
    vi.restoreAllMocks();
  });
});
