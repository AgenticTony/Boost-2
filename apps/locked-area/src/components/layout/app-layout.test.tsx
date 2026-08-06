import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { renderWithProviders } from "@/test/test-utils";
import { supabaseMock, signedInAs } from "@/test/supabase-mock";

function AuthLayout() {
  return <Outlet />;
}

/**
 * Mirrors App.tsx's layout-route shape: auth screens carry no chrome, member
 * pages carry the header.
 */
function routeTable() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<p>inloggningssidan</p>} />
      </Route>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <>
              <p>biblioteket</p>
              <Link to="/login">till inloggning</Link>
            </>
          }
        />
      </Route>
    </Routes>
  );
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AppLayout header visibility", () => {
  it("shows the header for an authenticated member", async () => {
    signedInAs();
    renderWithProviders(routeTable());

    expect(await screen.findByText("biblioteket")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("hides the header after navigating to an auth route", async () => {
    const user = userEvent.setup();
    signedInAs();
    renderWithProviders(routeTable());

    expect(await screen.findByRole("banner")).toBeInTheDocument();

    await user.click(screen.getByText("till inloggning"));
    expect(await screen.findByText("inloggningssidan")).toBeInTheDocument();

    // The regression: App.tsx read window.location.pathname during render, a
    // value that never changes on client-side navigation. The authenticated
    // header — logout button and member email included — stayed mounted over
    // the login screen.
    await waitFor(() =>
      expect(screen.queryByRole("banner")).not.toBeInTheDocument(),
    );
    expect(screen.queryByText("Logga ut")).not.toBeInTheDocument();
  });

  it("omits the header when no one is signed in", async () => {
    supabaseMock.setInitialSession(null);
    renderWithProviders(routeTable());

    expect(await screen.findByText("biblioteket")).toBeInTheDocument();
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
  });
});
