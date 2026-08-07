// Supabase Edge Function (Deno). Not part of the Vite build - it is deployed
// separately with `supabase functions deploy delete-user`.
//
// Deleting an auth user requires the service-role key, which bypasses row-level
// security entirely and therefore must never reach the browser. That is the
// whole reason this function exists rather than the client calling
// auth.admin.deleteUser directly.
//
// @ts-expect-error -- Deno-only remote import; resolved at deploy time.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  authorizeDeletion,
  type Principal,
} from "../_shared/authorize-deletion.ts";

// @ts-expect-error -- Deno global, absent from the app's TS lib.
const env = Deno.env;

const SUPABASE_URL = env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = env.get("SUPABASE_ANON_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": env.get("ALLOWED_ORIGIN") ?? "*",
  // supabase-js attaches x-client-info and apikey to every invoke(). Omitting
  // them here fails the CORS preflight before the request is ever sent, which
  // surfaces as an opaque "Failed to send a request to the Edge Function".
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

/** Reads a profile with the service-role client, bypassing RLS deliberately. */
async function readPrincipal(
  admin: ReturnType<typeof createClient>,
  id: string,
): Promise<Principal | null> {
  const { data, error } = await admin
    .from("profiles")
    .select("id, is_admin")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return { id: data.id as string, isAdmin: Boolean(data.is_admin) };
}

// @ts-expect-error -- Deno global.
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json({ code: "method_not_allowed", message: "Använd POST." }, 405);
  }

  // 1. Identify the caller from their JWT. The anon client is used here on
  //    purpose: it resolves the token to a user without any elevated rights.
  const authHeader = req.headers.get("Authorization") ?? "";
  const caller = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
  } = await caller.auth.getUser();

  const service = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 2. Re-read the caller's admin status from the database. Never trust
  //    is_admin from the request body or a JWT claim - a client that can send
  //    a target id can just as easily send `isAdmin: true`.
  const actor = user ? await readPrincipal(service, user.id) : null;

  let targetId: string | undefined;
  try {
    ({ targetId } = await req.json());
  } catch {
    return json({ code: "bad_request", message: "Ogiltig förfrågan." }, 400);
  }

  if (!targetId || typeof targetId !== "string") {
    return json({ code: "bad_request", message: "targetId saknas." }, 400);
  }

  const target = await readPrincipal(service, targetId);
  const decision = authorizeDeletion(actor, target);

  if (!decision.allowed) {
    // Logged with both principals so a refused deletion is attributable.
    console.warn("delete-user refused", {
      code: decision.code,
      actor: actor?.id ?? "anonymous",
      target: targetId,
    });
    return json(
      { code: decision.code, message: decision.message },
      decision.status,
    );
  }

  const { error } = await service.auth.admin.deleteUser(targetId);

  if (error) {
    console.error("delete-user failed", {
      actor: actor?.id,
      target: targetId,
      error: error.message,
    });
    return json(
      { code: "delete_failed", message: "Kunde inte ta bort användaren." },
      500,
    );
  }

  // The profiles row goes with it: profiles.id references auth.users on
  // delete cascade (see sql/01_profiles_and_rls.sql).
  console.info("delete-user ok", { actor: actor?.id, target: targetId });
  return json({ ok: true }, 200);
});
