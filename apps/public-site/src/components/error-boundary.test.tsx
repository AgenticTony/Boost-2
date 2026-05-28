import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./error-boundary";

function ThrowingChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("Test error");
  return <div>Child rendered fine</div>;
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("ErrorBoundary", () => {
  // Suppress console.error from React's error boundary logging
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it("renders children when no error", () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Child rendered fine")).toBeInTheDocument();
  });

  it("shows fallback UI when child throws", () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Något gick fel")).toBeInTheDocument();
    expect(screen.getByText(/Ett oväntat fel uppstod/i)).toBeInTheDocument();
  });

  it("renders retry button", () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("button", { name: /Försök igen/i }),
    ).toBeInTheDocument();
  });

  it("renders link to homepage", () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    const link = screen.getByRole("link", { name: /Till startsidan/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("retries on button click (re-mounts children)", async () => {
    const user = userEvent.setup();
    const { rerender } = renderWithRouter(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Error state
    expect(screen.getByText("Något gick fel")).toBeInTheDocument();

    // Rerender with non-throwing child, then click retry
    rerender(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowingChild shouldThrow={false} />
        </ErrorBoundary>
      </BrowserRouter>,
    );

    // Still in error state — need to click retry
    const retryButton = screen.queryByRole("button", { name: /Försök igen/i });
    if (retryButton) {
      await user.click(retryButton);
    }

    // Now children should render
    expect(screen.getByText("Child rendered fine")).toBeInTheDocument();
  });
});
