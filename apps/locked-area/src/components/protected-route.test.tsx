import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/protected-route";
import { renderWithProviders } from "@/test/test-utils";
import {
  supabaseMock,
  makeSession,
  makeProfile,
  signedInAs,
} from "@/test/supabase-mock";

/**
 * Renders the guard inside a route table so a redirect to /login is observable
 * as rendered output rather than a history side effect.
 */
function renderGuarded(route = "/") {
  return renderWithProviders(
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <p>skyddat innehåll</p>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<p>inloggningssidan</p>} />
    </Routes>,
    { route },
  );
}

describe("ProtectedRoute", () => {
  it("shows the loading state before the session resolves", () => {
    // INITIAL_SESSION is emitted on a microtask, so this is the pre-resolve frame.
    renderGuarded();
    expect(screen.getByText("Laddar...")).toBeInTheDocument();
  });

  it("redirects to /login when there is no session", async () => {
    supabaseMock.setInitialSession(null);
    renderGuarded();

    expect(await screen.findByText("inloggningssidan")).toBeInTheDocument();
    expect(screen.queryByText("skyddat innehåll")).not.toBeInTheDocument();
  });

  it("renders children for an approved member", async () => {
    signedInAs({ approved: true });
    renderGuarded();

    expect(await screen.findByText("skyddat innehåll")).toBeInTheDocument();
  });

  it("shows the pending-approval screen for an unapproved member", async () => {
    signedInAs({ approved: false });
    renderGuarded();

    expect(
      await screen.findByText("Konto väntar på godkännande"),
    ).toBeInTheDocument();
    expect(screen.queryByText("skyddat innehåll")).not.toBeInTheDocument();
  });

  it("keeps showing the loading state while the profile fetch is in flight", async () => {
    supabaseMock.setInitialSession(makeSession());
    const pending = supabaseMock.deferQuery();

    renderGuarded();

    // Session known, profile not yet. The guard must not decide anything here.
    await waitFor(() =>
      expect(supabaseMock.client.from).toHaveBeenCalledWith("profiles"),
    );
    expect(screen.queryByText("inloggningssidan")).not.toBeInTheDocument();
    expect(screen.queryByText("skyddat innehåll")).not.toBeInTheDocument();

    pending.resolve({ data: makeProfile({ approved: true }), error: null });
    expect(await screen.findByText("skyddat innehåll")).toBeInTheDocument();
  });

  it("unsubscribes from auth changes on unmount", async () => {
    signedInAs();
    const { unmount } = renderGuarded();

    await screen.findByText("skyddat innehåll");
    unmount();

    expect(supabaseMock.unsubscribe).toHaveBeenCalled();
  });
});
