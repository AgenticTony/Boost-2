import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import KontaktPage from "./kontakt";

function renderPage(initialEntry = "/kontakt") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <KontaktPage />
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

/** Submit the form directly via fireEvent to bypass jsdom native validation */
function submitForm() {
  const form = document.querySelector("form")!;
  fireEvent.submit(form);
}

describe("KontaktPage (Contact form)", () => {
  it("renders the contact form with all fields", () => {
    renderPage();
    expect(screen.getByLabelText(/^Namn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-post/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ämne/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Meddelande/i)).toBeInTheDocument();
  });

  it("renders contact info (address, phone, email)", () => {
    renderPage();
    expect(screen.getByText(/Norra Grängesbergsgatan/i)).toBeInTheDocument();
    expect(screen.getByText(/070-992 17 66/i)).toBeInTheDocument();
    expect(screen.getByText(/info@boostbyfcr.se/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    renderPage();
    expect(
      screen.getByRole("button", { name: /Skicka meddelande/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    renderPage();

    submitForm();

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows error for invalid email", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/^Namn/i), "Test User");
    await user.type(screen.getByLabelText(/E-post/i), "bad-email");
    await user.selectOptions(screen.getByLabelText(/Ämne/i), "Allmän fråga");
    await user.type(screen.getByLabelText(/Meddelande/i), "Hej!");

    submitForm();

    await waitFor(() => {
      expect(screen.getByText(/giltig e-postadress/i)).toBeInTheDocument();
    });
  });

  it("shows success state after valid submission", async () => {
    vi.stubEnv("VITE_CONTACT_WORKER_URL", "https://worker.test/submit");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, id: "abc" }),
      }),
    );
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/^Namn/i), "Anna Andersson");
    await user.type(screen.getByLabelText(/E-post/i), "anna@test.se");
    await user.selectOptions(screen.getByLabelText(/Ämne/i), "Allmän fråga");
    await user.type(
      screen.getByLabelText(/Meddelande/i),
      "Hej, jag vill veta mer om Boost.",
    );

    submitForm();

    await waitFor(
      () => {
        expect(
          screen.getByText(/Tack för ditt meddelande/i),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Form is wired to the contact worker, so the submission IS delivered —
    // the "not actually sent" notice should NOT appear.
    expect(screen.queryByText(/har inte skickats/i)).not.toBeInTheDocument();

    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("has subject options in select", () => {
    renderPage();
    expect(screen.getByText("Allmän fråga")).toBeInTheDocument();
    expect(screen.getByText("Företagssamarbete")).toBeInTheDocument();
    expect(screen.getByText("Press & Media")).toBeInTheDocument();
  });

  it("prefills subject from URL search params", () => {
    renderPage("/kontakt?amne=Föreläsning / Workshop");
    const select = screen.getByLabelText(/Ämne/i) as HTMLSelectElement;
    expect(select.value).toBe("Föreläsning / Workshop");
  });

  it("has honeypot field hidden from users", () => {
    renderPage();
    const honeypot = document.querySelector(
      'input[name="website"]',
    ) as HTMLInputElement;
    expect(honeypot).toBeInTheDocument();
    expect(honeypot.tabIndex).toBe(-1);
  });
});
