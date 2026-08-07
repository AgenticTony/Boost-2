import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import ResetPassword from "@/pages/reset-password";
import { renderWithProviders } from "@/test/test-utils";
import { supabaseMock, makeSession, makeProfile } from "@/test/supabase-mock";
import { STRONG_INPUT, WEAK_INPUT } from "@/test/fixtures";

function renderReset() {
  return renderWithProviders(
    <Routes>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login" element={<p>inloggningssidan</p>} />
      <Route path="/forgot-password" element={<p>glömt lösenord</p>} />
    </Routes>,
    { route: "/reset-password" },
  );
}

/** A recovery link produces a real session before any profile is loaded. */
function withRecoverySession() {
  supabaseMock.setInitialSession(makeSession());
  supabaseMock.resolveQueries({ data: makeProfile(), error: null });
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

describe("ResetPassword — link validity", () => {
  it("explains an expired or already-used link instead of showing the form", async () => {
    supabaseMock.setInitialSession(null);
    renderReset();

    expect(
      await screen.findByText("Länken är ogiltig eller har gått ut"),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Nytt lösenord")).not.toBeInTheDocument();
  });

  it("offers a route to request a fresh link", async () => {
    supabaseMock.setInitialSession(null);
    renderReset();

    const link = await screen.findByRole("link", { name: "Begär en ny länk" });
    expect(link).toHaveAttribute("href", "/forgot-password");
  });

  it("shows the form when the recovery session is valid", async () => {
    withRecoverySession();
    renderReset();

    expect(await screen.findByLabelText("Nytt lösenord")).toBeInTheDocument();
  });
});

describe("ResetPassword — submission", () => {
  it("enforces the shared password policy before calling Supabase", async () => {
    const user = userEvent.setup();
    withRecoverySession();
    renderReset();

    const password = await screen.findByLabelText("Nytt lösenord");
    await user.type(password, WEAK_INPUT);
    await user.type(screen.getByLabelText("Bekräfta lösenord"), WEAK_INPUT);
    await user.click(
      screen.getByRole("button", { name: "Uppdatera lösenord" }),
    );

    await waitFor(() =>
      expect(supabaseMock.client.auth.updateUser).not.toHaveBeenCalled(),
    );
  });

  it("translates a Supabase failure into Swedish", async () => {
    const user = userEvent.setup();
    withRecoverySession();
    supabaseMock.auth.updateUser = {
      error: { message: "Password should be at least 6 characters" },
    };
    renderReset();

    const password = await screen.findByLabelText("Nytt lösenord");
    await user.type(password, STRONG_INPUT);
    await user.type(screen.getByLabelText("Bekräfta lösenord"), STRONG_INPUT);
    await user.click(
      screen.getByRole("button", { name: "Uppdatera lösenord" }),
    );

    // The page used to render error.message raw - English text in an
    // otherwise fully Swedish interface.
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Lösenordet uppfyller inte kraven");
    expect(alert).not.toHaveTextContent("Password should be");
  });

  it("confirms success and routes onward", async () => {
    const user = userEvent.setup();
    withRecoverySession();
    renderReset();

    const password = await screen.findByLabelText("Nytt lösenord");
    await user.type(password, STRONG_INPUT);
    await user.type(screen.getByLabelText("Bekräfta lösenord"), STRONG_INPUT);
    await user.click(
      screen.getByRole("button", { name: "Uppdatera lösenord" }),
    );

    expect(await screen.findByText("Lösenord uppdaterat!")).toBeInTheDocument();
    expect(supabaseMock.client.auth.updateUser).toHaveBeenCalled();
  });

  it("does not leave a redirect timer running after unmount", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      withRecoverySession();
      const { unmount } = renderReset();

      const password = await screen.findByLabelText("Nytt lösenord");
      await user.type(password, STRONG_INPUT);
      await user.type(screen.getByLabelText("Bekräfta lösenord"), STRONG_INPUT);
      await user.click(
        screen.getByRole("button", { name: "Uppdatera lösenord" }),
      );
      await screen.findByText("Lösenord uppdaterat!");

      unmount();
      // Would warn about navigating an unmounted tree if the timer survived.
      vi.advanceTimersByTime(10_000);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
