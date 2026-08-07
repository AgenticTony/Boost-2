import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import Login from "@/pages/login";
import { renderWithProviders } from "@/test/test-utils";
import { supabaseMock, signedInAs } from "@/test/supabase-mock";
import { STRONG_INPUT, OTHER_STRONG_INPUT, WEAK_INPUT } from "@/test/fixtures";

function renderLogin() {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<p>biblioteket</p>} />
      <Route path="/forgot-password" element={<p>glömt lösenord</p>} />
    </Routes>,
    { route: "/login" },
  );
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  supabaseMock.setInitialSession(null);
});

afterEach(() => vi.restoreAllMocks());

describe("Login — tabs", () => {
  it("starts on the login tab", async () => {
    renderLogin();
    const loginTab = await screen.findByRole("tab", { name: "Logga in" });
    expect(loginTab).toHaveAttribute("aria-selected", "true");
  });

  it("associates each tab with its panel", async () => {
    renderLogin();
    const loginTab = await screen.findByRole("tab", { name: "Logga in" });
    expect(loginTab).toHaveAttribute("aria-controls", "panel-login");
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "tab-login",
    );
  });

  it("moves between tabs with arrow keys", async () => {
    const user = userEvent.setup();
    renderLogin();

    const loginTab = await screen.findByRole("tab", { name: "Logga in" });
    loginTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Skapa konto" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("switches to registration via the inline link", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(await screen.findByText("Skapa ett här"));
    expect(screen.getByLabelText("Namn")).toBeInTheDocument();
  });
});

describe("Login — validation", () => {
  it("rejects an invalid email without calling Supabase", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(await screen.findByLabelText("E-post"), "inte-en-epost");
    await user.type(screen.getByLabelText("Lösenord"), STRONG_INPUT);
    await user.click(screen.getByRole("button", { name: /Logga in/ }));

    expect(
      await screen.findByText("Ange en giltig e-postadress"),
    ).toBeInTheDocument();
    expect(supabaseMock.client.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("associates the error with its input for assistive tech", async () => {
    const user = userEvent.setup();
    renderLogin();

    const email = await screen.findByLabelText("E-post");
    await user.type(email, "nope");
    await user.click(screen.getByRole("button", { name: /Logga in/ }));

    await waitFor(() => expect(email).toHaveAttribute("aria-invalid", "true"));
    expect(email).toHaveAccessibleDescription("Ange en giltig e-postadress");
  });

  it("surfaces a failed sign-in as a translated alert", async () => {
    const user = userEvent.setup();
    supabaseMock.auth.signInWithPassword = {
      error: { message: "Invalid login credentials" },
    };
    renderLogin();

    await user.type(await screen.findByLabelText("E-post"), "a@b.se");
    await user.type(screen.getByLabelText("Lösenord"), STRONG_INPUT);
    await user.click(screen.getByRole("button", { name: /Logga in/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Felaktig e-post eller lösenord",
    );
  });
});

describe("Login — registration", () => {
  async function openRegister(user: ReturnType<typeof userEvent.setup>) {
    await user.click(await screen.findByRole("tab", { name: "Skapa konto" }));
  }

  it("blocks a password that fails the policy", async () => {
    const user = userEvent.setup();
    renderLogin();
    await openRegister(user);

    await user.type(screen.getByLabelText("Namn"), "Test Testsson");
    await user.type(screen.getByLabelText("E-post"), "a@b.se");
    await user.type(screen.getByLabelText("Lösenord"), WEAK_INPUT);
    await user.type(screen.getByLabelText("Bekräfta lösenord"), WEAK_INPUT);
    await user.click(screen.getByRole("button", { name: /Skapa konto/ }));

    await waitFor(() =>
      expect(supabaseMock.client.auth.signUp).not.toHaveBeenCalled(),
    );
  });

  it("blocks mismatched passwords", async () => {
    const user = userEvent.setup();
    renderLogin();
    await openRegister(user);

    await user.type(screen.getByLabelText("Namn"), "Test Testsson");
    await user.type(screen.getByLabelText("E-post"), "a@b.se");
    await user.type(screen.getByLabelText("Lösenord"), STRONG_INPUT);
    await user.type(
      screen.getByLabelText("Bekräfta lösenord"),
      OTHER_STRONG_INPUT,
    );
    await user.click(screen.getByRole("button", { name: /Skapa konto/ }));

    expect(
      await screen.findByText("Lösenorden matchar inte"),
    ).toBeInTheDocument();
    expect(supabaseMock.client.auth.signUp).not.toHaveBeenCalled();
  });

  it("shows the strength meter as requirements are met", async () => {
    const user = userEvent.setup();
    renderLogin();
    await openRegister(user);

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Lösenord"), STRONG_INPUT);
    expect(await screen.findByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("returns to the login tab with a confirmation on success", async () => {
    const user = userEvent.setup();
    renderLogin();
    await openRegister(user);

    await user.type(screen.getByLabelText("Namn"), "Test Testsson");
    await user.type(screen.getByLabelText("E-post"), "a@b.se");
    await user.type(screen.getByLabelText("Lösenord"), STRONG_INPUT);
    await user.type(screen.getByLabelText("Bekräfta lösenord"), STRONG_INPUT);
    await user.click(screen.getByRole("button", { name: /Skapa konto/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Konto skapat!");
    expect(screen.getByRole("tab", { name: "Logga in" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});

describe("Login — already authenticated", () => {
  it("redirects an authenticated visitor away from the form", async () => {
    signedInAs();
    renderLogin();

    expect(await screen.findByText("biblioteket")).toBeInTheDocument();
  });
});
