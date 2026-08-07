/**
 * Who may delete whom.
 *
 * Deliberately free of imports so the same rules run inside the Deno edge
 * function and inside the vitest suite. The authorization decision is the part
 * of this feature worth testing exhaustively - everything around it is
 * plumbing - and a rule that can only be exercised by deploying is a rule
 * nobody exercises.
 *
 * Every input here must be read from the database by the caller, never taken
 * from the request body or a JWT claim. A client that can name the target can
 * also name itself as an admin.
 */

export interface Principal {
  id: string;
  isAdmin: boolean;
}

export type DeletionDecision =
  | { allowed: true }
  | { allowed: false; status: number; code: string; message: string };

export function authorizeDeletion(
  actor: Principal | null,
  target: Principal | null,
): DeletionDecision {
  if (!actor) {
    return {
      allowed: false,
      status: 401,
      code: "unauthenticated",
      message: "Du måste vara inloggad.",
    };
  }

  if (!actor.isAdmin) {
    return {
      allowed: false,
      status: 403,
      code: "not_admin",
      message: "Du har inte behörighet att ta bort användare.",
    };
  }

  if (!target) {
    return {
      allowed: false,
      status: 404,
      code: "target_not_found",
      message: "Användaren hittades inte.",
    };
  }

  // Locking yourself out is not a recoverable mistake through this UI.
  if (target.id === actor.id) {
    return {
      allowed: false,
      status: 409,
      code: "self_deletion",
      message: "Du kan inte ta bort ditt eget konto här.",
    };
  }

  // One compromised admin session should not be able to remove the others.
  // Demoting an admin stays a SQL Editor operation, same as promoting one.
  if (target.isAdmin) {
    return {
      allowed: false,
      status: 409,
      code: "target_is_admin",
      message:
        "Administratörer kan inte tas bort här. Ta bort admin-rollen i Supabase först.",
    };
  }

  return { allowed: true };
}
