import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import AnmalDigPage from "./anmal-dig";

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AnmalDigPage />
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

/** Submit the form directly via fireEvent to bypass jsdom native validation. */
function submitForm() {
  const form = document.querySelector("form")!;
  fireEvent.submit(form);
}

/** Fill every required field with valid values (consent checked). */
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText(/För- och efternamn/i),
    "Anna Andersson",
  );
  await user.type(screen.getByLabelText(/Personnummer/i), "990101-1234");
  await user.type(screen.getByLabelText(/^Telefonnummer$/i), "070-123 45 67");
  await user.type(screen.getByLabelText(/Mejladress/i), "anna@test.se");
  await user.type(
    screen.getByLabelText(/Handläggare, namn/i),
    "Maria Vägledare",
  );
  await user.type(
    screen.getByLabelText(/Handläggare, mejl/i),
    "maria@boostbyfcr.se",
  );
  await user.selectOptions(
    screen.getByLabelText(/inskrivningsmöte/i),
    "23 juli kl 14:00",
  );
  await user.click(screen.getByLabelText(/godkänner behandling/i));
}

describe("AnmalDigPage (Anmälan → Google Form)", () => {
  // The page fetches /api/slots on mount. Stub global fetch so that resolves
  // (page keeps its fallback slots); tests override where they need to.
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    fetchMock = vi.fn((url: string) =>
      Promise.resolve(
        String(url).includes("/api/slots")
          ? { ok: true, json: () => Promise.resolve({ slots: [] }) }
          : { ok: true },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the form with all fields", () => {
    renderPage();
    expect(screen.getByLabelText(/För- och efternamn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Personnummer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Telefonnummer$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mejladress/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Handläggare, namn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/inskrivningsmöte/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    renderPage();
    expect(
      screen.getByRole("button", { name: /Skicka anmälan/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors on empty submit and does not submit to Google", async () => {
    renderPage();

    submitForm();

    await waitFor(() => {
      expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(1);
    });
    // /api/slots fires on mount, but a blocked submit must never hit Google.
    const googleCalls = fetchMock.mock.calls.filter(
      (call) => Array.isArray(call) && String(call[0]).includes("docs.google.com"),
    );
    expect(googleCalls).toHaveLength(0);
  });

  it("shows error for invalid email", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/För- och efternamn/i), "Anna");
    await user.type(screen.getByLabelText(/Personnummer/i), "990101-1234");
    await user.type(screen.getByLabelText(/Mejladress/i), "not-an-email");
    await user.type(screen.getByLabelText(/Handläggare, namn/i), "Maria");
    await user.selectOptions(
      screen.getByLabelText(/inskrivningsmöte/i),
      "23 juli kl 14:00",
    );
    await user.click(screen.getByLabelText(/godkänner behandling/i));

    submitForm();

    await waitFor(() => {
      expect(screen.getByText(/giltig e-postadress/i)).toBeInTheDocument();
    });
  });

  it("requires GDPR consent", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/För- och efternamn/i), "Anna");
    await user.type(screen.getByLabelText(/Personnummer/i), "990101-1234");
    await user.type(screen.getByLabelText(/Handläggare, namn/i), "Maria");
    await user.selectOptions(
      screen.getByLabelText(/inskrivningsmöte/i),
      "23 juli kl 14:00",
    );
    // consent deliberately NOT checked

    submitForm();

    await waitFor(() => {
      expect(
        screen.getByText(/godkänna behandling av personuppgifter/i),
      ).toBeInTheDocument();
    });
  });

  it("posts to the Google Form and shows success on valid submission", async () => {
    const user = userEvent.setup();
    renderPage();

    await fillValidForm(user);
    submitForm();

    await waitFor(() => {
      expect(screen.getByText(/din anmälan är mottagen/i)).toBeInTheDocument();
    });

    // /api/slots also fires on mount — filter to the Google POST specifically.
    const googleCalls = fetchMock.mock.calls.filter(
      (call) => Array.isArray(call) && String(call[0]).includes("docs.google.com"),
    );
    expect(googleCalls).toHaveLength(1);
    expect(googleCalls[0][1]).toMatchObject({ method: "POST", mode: "no-cors" });
  });

  it("shows an error if the network submission fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );
    const user = userEvent.setup();
    renderPage();

    await fillValidForm(user);
    submitForm();

    await waitFor(() => {
      expect(
        screen.getByText(/något gick fel vid sändningen/i),
      ).toBeInTheDocument();
    });
    vi.unstubAllGlobals();
  });

  it("has the current meeting time slots in the select", () => {
    renderPage();
    const select = screen.getByLabelText(
      /inskrivningsmöte/i,
    ) as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(screen.getByText("23 juli kl 14:00")).toBeInTheDocument();
    expect(screen.getByText("4 september kl 9:00")).toBeInTheDocument();
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
