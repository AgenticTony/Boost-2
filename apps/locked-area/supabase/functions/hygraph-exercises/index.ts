// Supabase Edge Function (Deno). Deployed separately from the Vite build:
//   supabase functions deploy hygraph-exercises
//
// Why this exists at all: the exercise library is members-only, and Hygraph
// reads need a token. public-site calls Hygraph straight from the browser,
// which is correct there because that content is public. Doing the same here
// would ship the endpoint and token in the JS bundle, so anyone could read the
// locked material without ever signing in.
//
// So the token stays server-side and every read passes through here, behind
// the same approval check the rest of the app uses.

// @ts-expect-error -- Deno-only remote import; resolved at deploy time.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  QUERIES,
  isQueryKey,
  pickVariables,
} from "../_shared/exercise-queries.ts";

// @ts-expect-error -- Deno global, absent from the app's TS lib.
const env = Deno.env;

const SUPABASE_URL = env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = env.get("SUPABASE_ANON_KEY")!;
const HYGRAPH_ENDPOINT = env.get("HYGRAPH_ENDPOINT");
const HYGRAPH_TOKEN = env.get("HYGRAPH_TOKEN");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status: number, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

// @ts-expect-error -- Deno global.
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ code: "method_not_allowed", message: "Använd POST." }, 405);
  }

  if (!HYGRAPH_ENDPOINT || !HYGRAPH_TOKEN) {
    // Deliberately explicit: this is the state before anyone has created the
    // content models, and a vague 500 would send someone hunting through app
    // code for a problem that lives in the project's secrets.
    console.error("hygraph-exercises: HYGRAPH_ENDPOINT or HYGRAPH_TOKEN unset");
    return json(
      {
        code: "not_configured",
        message: "Innehållskällan är inte konfigurerad ännu.",
      },
      503,
    );
  }

  // 1. Who is calling. The anon client resolves the JWT with no elevated
  //    rights of its own.
  const caller = createClient(SUPABASE_URL, ANON_KEY, {
    global: {
      headers: { Authorization: req.headers.get("Authorization") ?? "" },
    },
  });
  const {
    data: { user },
  } = await caller.auth.getUser();

  if (!user) {
    return json(
      { code: "unauthenticated", message: "Du måste vara inloggad." },
      401,
    );
  }

  // 2. Being signed in is not enough - the account must be approved. Read it
  //    from the database rather than from any claim the client supplied.
  const service = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: profile } = await service
    .from("profiles")
    .select("approved, denied")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.approved || profile.denied) {
    console.warn("hygraph-exercises refused", { user: user.id });
    return json(
      {
        code: "not_approved",
        message: "Ditt konto är inte godkänt för det här materialet.",
      },
      403,
    );
  }

  // 3. Pick a known query. The client names one; it never supplies GraphQL.
  let body: { query?: unknown; variables?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ code: "bad_request", message: "Ogiltig förfrågan." }, 400);
  }

  if (!isQueryKey(body.query)) {
    console.warn("hygraph-exercises: unknown query", { query: body.query });
    return json({ code: "unknown_query", message: "Okänd förfrågan." }, 400);
  }

  const response = await fetch(HYGRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({
      query: QUERIES[body.query],
      variables: pickVariables(body.query, body.variables),
    }),
  });

  if (!response.ok) {
    console.error("hygraph-exercises: upstream failed", {
      status: response.status,
    });
    return json(
      { code: "upstream_error", message: "Kunde inte hämta innehållet." },
      502,
    );
  }

  const result = await response.json();

  if (result.errors) {
    // Hygraph returns 200 with an errors array. Logged in full server-side;
    // the client gets a generic message, since GraphQL errors name internal
    // fields and models.
    console.error("hygraph-exercises: graphql errors", result.errors);
    return json(
      { code: "upstream_error", message: "Kunde inte hämta innehållet." },
      502,
    );
  }

  // Short cache: this content changes when Anna publishes, not per request,
  // and every read costs an edge invocation plus a Hygraph round trip.
  return json(result.data, 200, {
    "Cache-Control": "private, max-age=60",
  });
});
