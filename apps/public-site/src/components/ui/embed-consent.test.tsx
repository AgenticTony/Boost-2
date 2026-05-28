import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { EmbedConsent } from "./embed-consent";

const KEY = "test-embed-consent";

function renderGate(extra: Partial<Parameters<typeof EmbedConsent>[0]> = {}) {
  return render(
    <MemoryRouter>
      <EmbedConsent
        provider="Google"
        storageKey={KEY}
        description="Formuläret laddas från Google."
        {...extra}
      >
        {() => <iframe title="Anmälan" src="https://docs.google.com/forms/x" />}
      </EmbedConsent>
    </MemoryRouter>,
  );
}

describe("EmbedConsent", () => {
  beforeEach(() => localStorage.clear());

  it("does not put the embed in the DOM before consent", () => {
    // The whole point: hiding the iframe would still load it. It must not
    // exist, so the browser never contacts the third party.
    renderGate();

    expect(screen.queryByTitle("Anmälan")).not.toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("names the provider and links to the cookie policy", () => {
    renderGate();

    expect(
      screen.getByRole("heading", { name: /Formuläret laddas från Google/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cookiepolicy/i })).toHaveAttribute(
      "href",
      "/cookiepolicy",
    );
  });

  it("loads the embed once the visitor asks for it", async () => {
    const user = userEvent.setup();
    renderGate();

    await user.click(screen.getByRole("button", { name: /Öppna formuläret/i }));

    expect(await screen.findByTitle("Anmälan")).toBeInTheDocument();
  });

  it("remembers the choice so it is not asked again", async () => {
    const user = userEvent.setup();
    const first = renderGate();
    await user.click(screen.getByRole("button", { name: /Öppna formuläret/i }));
    expect(localStorage.getItem(KEY)).toBe("granted");
    first.unmount();

    renderGate();

    // Straight to the embed, no gate, no flicker.
    expect(screen.getByTitle("Anmälan")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Öppna formuläret/i }),
    ).toBeNull();
  });

  it("still shows the form when storage is unavailable", async () => {
    // Private browsing throws on getItem/setItem. That must not block anyone
    // from reaching the form - it just means we ask again next time.
    const spy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("denied");
      });
    const setSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("denied");
      });
    const user = userEvent.setup();

    renderGate();
    await user.click(screen.getByRole("button", { name: /Öppna formuläret/i }));

    expect(await screen.findByTitle("Anmälan")).toBeInTheDocument();
    spy.mockRestore();
    setSpy.mockRestore();
  });

  it("offers a way through for people who decline", () => {
    renderGate({ fallback: <a href="tel:+46709921766">070-992 17 66</a> });

    expect(
      screen.getByRole("link", { name: /070-992 17 66/ }),
    ).toBeInTheDocument();
  });
});
