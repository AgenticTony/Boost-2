import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import KontaktPage from "./kontakt";

// Mock the submit function so we can drive the kontakt form into the failure
// path (the real adapter always succeeds). Note: anmal-dig no longer routes
// through this adapter — it posts directly to the Google Form — so its failure
// path is covered in anmal-dig.test.tsx instead.
vi.mock("@/api/client", () => ({
  submitContact: vi.fn(),
}));

import * as api from "@/api/client";

function renderPage(node: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{node}</MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

const submitForm = () => fireEvent.submit(document.querySelector("form")!);

async function fillKontakt(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Namn/i), "Anna Andersson");
  await user.type(screen.getByLabelText(/E-post/i), "anna@test.se");
  await user.selectOptions(screen.getByLabelText(/Ämne/i), "Allmän fråga");
  await user.type(screen.getByLabelText(/Meddelande/i), "Hej!");
}

describe("forms — server failure path", () => {
  it("kontakt shows an error when submission throws", async () => {
    const user = userEvent.setup();
    vi.mocked(api.submitContact).mockRejectedValue(new Error("server down"));
    renderPage(<KontaktPage />);
    await fillKontakt(user);
    submitForm();
    await waitFor(() =>
      expect(screen.getByText(/Något gick fel/i)).toBeInTheDocument(),
    );
  });
});
