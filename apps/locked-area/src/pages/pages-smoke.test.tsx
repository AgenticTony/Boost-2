import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import Resources from "@/pages/resources";
import KnowledgeSection from "@/pages/knowledge-section";
import HandbookReader from "@/pages/handbook-reader";
import VerifyEmail from "@/pages/verify-email";
import ForgotPassword from "@/pages/forgot-password";
import { renderWithProviders } from "@/test/test-utils";
import { supabaseMock, signedInAs } from "@/test/supabase-mock";

/**
 * Render checks for the pages that had no test at all.
 *
 * These are mostly static content today, so there is little behaviour to
 * assert - but "renders without throwing" is exactly the guarantee they were
 * missing. Every one of them was at 0% coverage, which means a page that
 * crashed on mount would have shipped: the suite would still have been green.
 */
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  signedInAs();
});

afterEach(() => vi.restoreAllMocks());

describe("content pages render", () => {
  it("Resources shows its hero and contact cards", async () => {
    renderWithProviders(<Resources />);
    expect(
      await screen.findByRole("heading", { name: /Resurser & Kontakter/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Akut hjälp")).toBeInTheDocument();
  });

  it("Resources uses a phone icon, not an external-link glyph, for tel: links", async () => {
    renderWithProviders(<Resources />);
    const emergency = await screen.findByRole("link", { name: /Ring 112/ });
    expect(emergency).toHaveAttribute("href", "tel:112");
    // An external-link affordance here promised a new tab that never opened.
    expect(emergency).not.toHaveTextContent("öppnas i ny flik");
  });

  it("KnowledgeSection renders and filters articles by search", async () => {
    const user = userEvent.setup();
    renderWithProviders(<KnowledgeSection />);

    expect(
      await screen.findByRole("heading", { name: "Kunskapsbanken" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mental Träning för Unga Idrottare"),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText("Sök artiklar"), "taktik");
    expect(
      screen.queryByText("Mental Träning för Unga Idrottare"),
    ).not.toBeInTheDocument();
  });

  it("HandbookReader renders chapters and advances through them", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/" element={<HandbookReader />} />
      </Routes>,
    );

    expect(
      await screen.findByRole("heading", { name: "Metodhandbok för Ledare" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Kapitel 1 av 8")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Nästa kapitel/ }));
    expect(screen.getByText("Kapitel 2 av 8")).toBeInTheDocument();
  });

  it("HandbookReader tracks reading progress", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HandbookReader />);

    expect(await screen.findByText("0/8 kapitel")).toBeInTheDocument();

    // Exact name, not a regex: GuideSection also has an accordion step titled
    // "Markera som läst", whose accessible name carries its step number.
    await user.click(screen.getByRole("button", { name: "Markera som läst" }));
    expect(screen.getByText("1/8 kapitel")).toBeInTheDocument();
  });

  it("VerifyEmail points onward to login", async () => {
    renderWithProviders(<VerifyEmail />);
    expect(
      await screen.findByRole("heading", { name: "E-post verifierad!" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Till inloggning/ }),
    ).toHaveAttribute("href", "/login");
  });
});

describe("ForgotPassword", () => {
  beforeEach(() => supabaseMock.setInitialSession(null));

  it("rejects an invalid address without calling Supabase", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPassword />);

    await user.type(await screen.findByLabelText("E-post"), "inte-en-epost");
    await user.click(screen.getByRole("button", { name: /Skicka/ }));

    expect(
      await screen.findByText("Ange en giltig e-postadress"),
    ).toBeInTheDocument();
    expect(
      supabaseMock.client.auth.resetPasswordForEmail,
    ).not.toHaveBeenCalled();
  });

  it("confirms without revealing whether the account exists", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPassword />);

    await user.type(await screen.findByLabelText("E-post"), "okand@example.se");
    await user.click(screen.getByRole("button", { name: /Skicka/ }));

    // Deliberately non-committal: confirming the address would turn this form
    // into an account-enumeration oracle.
    const confirmation = await screen.findByText(/Om ett konto finns/);
    expect(confirmation).toBeInTheDocument();
    expect(supabaseMock.client.auth.resetPasswordForEmail).toHaveBeenCalled();
  });

  it("surfaces a failure as a translated alert", async () => {
    const user = userEvent.setup();
    supabaseMock.auth.resetPasswordForEmail = {
      error: { message: "rate limit exceeded" },
    };
    renderWithProviders(<ForgotPassword />);

    await user.type(await screen.findByLabelText("E-post"), "a@b.se");
    await user.click(screen.getByRole("button", { name: /Skicka/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "För många försök",
    );
  });
});
