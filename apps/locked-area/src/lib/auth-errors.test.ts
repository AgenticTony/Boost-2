import { describe, it, expect } from "vitest";
import { translateAuthError } from "@/lib/auth-errors";
import { MIN_PASSWORD_LENGTH } from "@/lib/password-policy";

describe("translateAuthError", () => {
  it("translates invalid login credentials", () => {
    expect(translateAuthError("Invalid login credentials")).toBe(
      "Felaktig e-post eller lösenord",
    );
  });

  it("translates already registered email", () => {
    expect(translateAuthError("User already registered")).toBe(
      "E-postadressen är redan registrerad",
    );
  });

  it("translates weak password using the app's own policy", () => {
    // Supabase reports its own minimum, which is looser than what this app
    // asks for. Echoing Supabase's number told members "minst 6 tecken" while
    // the form in front of them refused anything under 8.
    const message = translateAuthError(
      "Password should be at least 6 characters",
    );
    expect(message).toContain(`minst ${MIN_PASSWORD_LENGTH} tecken`);
    expect(message).not.toContain("6 tecken");
  });

  it("translates invalid email", () => {
    expect(translateAuthError("Invalid email format")).toBe(
      "Ogiltig e-postadress",
    );
  });

  it("translates email not confirmed", () => {
    expect(translateAuthError("Email not confirmed")).toBe(
      "Din e-post är inte verifierad ännu. Kontrollera din inkorg.",
    );
  });

  it("translates rate limit errors", () => {
    expect(translateAuthError("rate limit exceeded")).toBe(
      "För många försök. Försök igen om en stund.",
    );
  });

  it("returns generic message for unknown errors", () => {
    expect(translateAuthError("Some unknown error")).toBe(
      "Ett fel uppstod. Försök igen.",
    );
  });
});
