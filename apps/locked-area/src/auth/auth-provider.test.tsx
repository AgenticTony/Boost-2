import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/protected-route";
import { AUTH_TIMEOUT_MS } from "@/auth/auth-provider";
import { useAuth } from "@/auth/use-auth";
import { renderWithProviders } from "@/test/test-utils";
import {
  supabaseMock,
  makeSession,
  makeProfile,
  signedInAs,
} from "@/test/supabase-mock";

/**
 * Minimal stand-in for the login page's submit path: sign in, then navigate
 * straight to a protected route, exactly as `handleLogin` does.
 */
function LoginProbe() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={async () => {
        const result = await login("a@b.se", "hunter2");
        if (result.success) navigate("/", { replace: true });
      }}
    >
      logga in
    </button>
  );
}

function LogoutProbe() {
  const { logout, isAuthenticated } = useAuth();
  return (
    <>
      <span>{isAuthenticated ? "inloggad" : "utloggad"}</span>
      <button type="button" onClick={() => void logout()}>
        logga ut
      </button>
    </>
  );
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AuthProvider — profile fetch", () => {
  it("stays in the loading state while the profile request is in flight", async () => {
    supabaseMock.setInitialSession(makeSession());
    const pending = supabaseMock.deferQuery();

    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <p>biblioteket</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>inloggningssidan</p>} />
      </Routes>,
    );

    await waitFor(() =>
      expect(supabaseMock.client.from).toHaveBeenCalledWith("profiles"),
    );

    // The regression this guards: isLoading used to stay false across the
    // fetch, so the guard read "no user" as "signed out" and redirected.
    expect(screen.queryByText("inloggningssidan")).not.toBeInTheDocument();
    expect(screen.getByText("Laddar...")).toBeInTheDocument();

    pending.resolve({ data: makeProfile(), error: null });
    expect(await screen.findByText("biblioteket")).toBeInTheDocument();
  });

  it("surfaces an error instead of signing the member out when the profile fails", async () => {
    supabaseMock.setInitialSession(makeSession());
    supabaseMock.resolveQueries({
      data: null,
      error: { message: "network unreachable" },
    });

    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <p>biblioteket</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>inloggningssidan</p>} />
      </Routes>,
    );

    expect(
      await screen.findByText("Kunde inte ladda din profil"),
    ).toBeInTheDocument();
    expect(screen.queryByText("inloggningssidan")).not.toBeInTheDocument();
  });
});

describe("AuthProvider — login", () => {
  it("does not redirect to /login while the post-sign-in profile fetch is pending", async () => {
    const user = userEvent.setup();

    // No session yet: the provider settles as unauthenticated.
    supabaseMock.setInitialSession(null);

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginProbe />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <p>biblioteket</p>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { route: "/login" },
    );

    await screen.findByText("logga in");

    // Sign-in succeeds, but the profile row is held pending and SIGNED_IN has
    // not been dispatched yet — exactly the gap that used to bounce the user.
    const pending = supabaseMock.deferQuery();
    await user.click(screen.getByText("logga in"));

    await waitFor(() =>
      expect(supabaseMock.client.auth.signInWithPassword).toHaveBeenCalled(),
    );

    // Landed on the protected route. Before the fix the guard saw
    // isLoading=false with no user here and redirected straight back to
    // /login, stranding a member who was in fact signed in.
    expect(await screen.findByText("Laddar...")).toBeInTheDocument();
    expect(screen.queryByText("logga in")).not.toBeInTheDocument();

    supabaseMock.emitAuthState("SIGNED_IN", makeSession());
    await waitFor(() =>
      expect(supabaseMock.client.from).toHaveBeenCalledWith("profiles"),
    );
    expect(screen.getByText("Laddar...")).toBeInTheDocument();

    pending.resolve({ data: makeProfile(), error: null });
    expect(await screen.findByText("biblioteket")).toBeInTheDocument();
  });

  it("reports a translated error and stays put when sign-in fails", async () => {
    const user = userEvent.setup();
    supabaseMock.setInitialSession(null);
    supabaseMock.auth.signInWithPassword = {
      error: { message: "Invalid login credentials" },
    };

    function Probe() {
      const { login } = useAuth();
      return (
        <button
          type="button"
          onClick={async () => {
            const r = await login("a@b.se", "wrong");
            if (!r.success) document.title = r.error ?? "";
          }}
        >
          försök
        </button>
      );
    }

    renderWithProviders(<Probe />);
    await user.click(screen.getByText("försök"));

    await waitFor(() =>
      expect(document.title).toBe("Felaktig e-post eller lösenord"),
    );
  });
});

describe("AuthProvider — loading watchdog", () => {
  /** Renders the guard and advances fake timers inside act(). */
  async function advance(ms: number) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms);
    });
  }

  function guarded() {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <p>biblioteket</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>inloggningssidan</p>} />
      </Routes>
    );
  }

  it("gives up on a profile query that never settles", async () => {
    vi.useFakeTimers();
    try {
      supabaseMock.setInitialSession(makeSession());
      supabaseMock.deferQuery(); // never resolved

      renderWithProviders(guarded());
      await advance(0);
      expect(screen.getByText("Laddar...")).toBeInTheDocument();

      // Still within budget.
      await advance(AUTH_TIMEOUT_MS - 1000);
      expect(screen.getByText("Laddar...")).toBeInTheDocument();

      await advance(1000);
      expect(
        screen.getByText("Kunde inte ladda din profil"),
      ).toBeInTheDocument();
      expect(screen.queryByText("Laddar...")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("gives up when SIGNED_IN never follows a successful sign-in", async () => {
    vi.useFakeTimers();
    try {
      supabaseMock.setInitialSession(null);

      // Observes provider state directly: the watchdog lives in the provider,
      // and routing the assertion through ProtectedRoute would only test the
      // guard's rendering.
      function Probe() {
        const { login, isLoading, profileError } = useAuth();
        return (
          <>
            <span data-testid="state">
              {profileError ?? (isLoading ? "loading" : "idle")}
            </span>
            <button type="button" onClick={() => void login("a@b.se", "pw")}>
              logga in
            </button>
          </>
        );
      }

      renderWithProviders(<Probe />);
      await advance(0);
      expect(screen.getByTestId("state")).toHaveTextContent("idle");

      // Sign-in succeeds, but no auth event ever arrives.
      await act(async () => {
        screen.getByText("logga in").click();
      });
      await advance(0);
      expect(screen.getByTestId("state")).toHaveTextContent("loading");

      await advance(AUTH_TIMEOUT_MS);
      expect(screen.getByTestId("state")).toHaveTextContent(
        "Det tog för lång tid",
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not fire on a healthy sign-in", async () => {
    vi.useFakeTimers();
    try {
      signedInAs();
      renderWithProviders(guarded());
      await advance(0);

      expect(screen.getByText("biblioteket")).toBeInTheDocument();

      // Well past the budget, with the session already resolved.
      await advance(AUTH_TIMEOUT_MS * 2);
      expect(screen.getByText("biblioteket")).toBeInTheDocument();
      expect(
        screen.queryByText("Kunde inte ladda din profil"),
      ).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("AuthProvider — logout", () => {
  it("clears the session and navigates without a full page reload", async () => {
    const user = userEvent.setup();
    signedInAs();

    renderWithProviders(
      <Routes>
        <Route path="/" element={<LogoutProbe />} />
        <Route path="/login" element={<p>inloggningssidan</p>} />
      </Routes>,
    );

    expect(await screen.findByText("inloggad")).toBeInTheDocument();

    await user.click(screen.getByText("logga ut"));

    // Navigation, not window.location assignment: the router renders the login
    // route in place, which a real page load could never do in jsdom.
    expect(await screen.findByText("inloggningssidan")).toBeInTheDocument();
    expect(supabaseMock.client.auth.signOut).toHaveBeenCalled();
  });
});
