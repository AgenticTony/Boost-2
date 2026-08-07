import { supabase } from "@/lib/supabase";

/**
 * Everything the approvals screen needs from the backend, in one place.
 *
 * The page previously reached for the `supabase` singleton directly, which
 * meant it could not be tested without a live project and put query details in
 * a component. public-site solves the same problem with `api/adapter.ts`; this
 * is the equivalent seam for the member area.
 */

export interface PendingUser {
  id: string;
  full_name: string | null;
  email: string;
  approved: boolean;
  is_admin: boolean;
}

export class AdminApiError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AdminApiError";
    this.code = code;
  }
}

const GENERIC = "Något gick fel. Kontrollera din anslutning och försök igen.";

/**
 * Accounts awaiting a decision.
 *
 * Excludes denied accounts: a rejected account is not still "pending", and
 * without the filter it would reappear in this queue forever.
 */
export async function fetchPendingUsers(): Promise<PendingUser[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, approved, is_admin")
    .eq("approved", false)
    .eq("denied", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("fetchPendingUsers failed", error);
    throw new AdminApiError("fetch_failed", "Kunde inte hämta användare.");
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    full_name: (row.full_name as string | null) ?? null,
    email: (row.email as string | null) ?? "",
    approved: Boolean(row.approved),
    is_admin: Boolean(row.is_admin),
  }));
}

export async function approveUser(id: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ approved: true })
    .eq("id", id);

  if (error) {
    console.error("approveUser failed", error);
    throw new AdminApiError(
      "approve_failed",
      "Kunde inte godkänna användaren. Försök igen.",
    );
  }
}

/**
 * Mark an account as rejected without destroying it.
 *
 * Runs before {@link deleteUser} so that a failed deletion still takes the
 * account out of the queue - the operator's decision is recorded either way,
 * and they are not left re-deciding the same account after every hiccup.
 */
export async function denyUser(id: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ denied: true })
    .eq("id", id);

  if (error) {
    console.error("denyUser failed", error);
    throw new AdminApiError(
      "deny_failed",
      "Kunde inte neka användaren. Försök igen.",
    );
  }
}

/**
 * Permanently delete the auth user via the `delete-user` edge function.
 *
 * Not a table operation: removing an auth user needs the service-role key,
 * which bypasses row-level security and must never be shipped to the browser.
 * The function re-checks the caller's admin status server-side.
 */
export async function deleteUser(id: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("delete-user", {
    body: { targetId: id },
  });

  if (error) {
    console.error("deleteUser failed", error);
    const message = (data as { message?: string } | null)?.message ?? GENERIC;
    const code = (data as { code?: string } | null)?.code ?? "delete_failed";
    throw new AdminApiError(code, message);
  }
}
