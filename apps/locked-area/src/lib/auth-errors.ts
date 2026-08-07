import { MIN_PASSWORD_LENGTH } from "@/lib/password-policy";

/**
 * Translates Supabase auth error messages to Swedish user-facing text.
 * Used by all auth operations (login, register, resetPassword).
 */
export function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials"))
    return "Felaktig e-post eller lösenord";
  if (message.includes("already registered"))
    return "E-postadressen är redan registrerad";
  if (message.includes("Password should be"))
    return `Lösenordet uppfyller inte kraven (minst ${MIN_PASSWORD_LENGTH} tecken, versal, siffra och specialtecken)`;
  if (message.includes("Invalid email")) return "Ogiltig e-postadress";
  if (message.includes("Email not confirmed"))
    return "Din e-post är inte verifierad ännu. Kontrollera din inkorg.";
  if (message.includes("rate limit") || message.includes("too many"))
    return "För många försök. Försök igen om en stund.";
  return "Ett fel uppstod. Försök igen.";
}
