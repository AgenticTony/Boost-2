import { vi } from "vitest";

/**
 * Controllable stand-in for the `@supabase/supabase-js` client.
 *
 * The real client is a network object created at module load, and
 * `@/lib/supabase` throws outright when its env vars are absent - so nothing
 * that touches auth or the database was testable before this existed.
 *
 * Two behaviours matter more than breadth of API coverage:
 *
 * 1. `onAuthStateChange` re-emits an initial event on subscribe, the way
 *    supabase-js emits `INITIAL_SESSION`. `AuthProvider` depends on that
 *    callback to leave its loading state, so a mock that stays silent would
 *    hang every test.
 * 2. Query results can be held *pending* via {@link SupabaseMock.deferQuery}.
 *    The login redirect race only reproduces while the profile fetch is
 *    in flight, so a mock that always resolves immediately cannot express it.
 */

// ── Types ───────────────────────────────────────────────

export interface MockAuthError {
  message: string;
}

export interface MockSession {
  user: { id: string; email?: string };
}

export type MockAuthEvent =
  | "INITIAL_SESSION"
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "TOKEN_REFRESHED"
  | "USER_UPDATED"
  | "PASSWORD_RECOVERY";

export interface MockQueryResult<T = unknown> {
  data: T | null;
  error: MockAuthError | null;
}

/** A recorded `.from(...)` chain, passed to the active query handler. */
export interface MockQueryCall {
  table: string;
  operation: "select" | "update" | "insert" | "delete";
  columns?: string;
  payload?: unknown;
  filters: Array<{ column: string; value: unknown }>;
  order?: { column: string; ascending: boolean };
  /** True when the chain ended in `.single()` or `.maybeSingle()`. */
  single: boolean;
}

export type MockFunctionHandler = (
  name: string,
  body: unknown,
) =>
  | { data: unknown; error: { message: string } | null }
  | Promise<{ data: unknown; error: { message: string } | null }>;

export type MockQueryHandler = (
  call: MockQueryCall,
) => MockQueryResult | Promise<MockQueryResult>;

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

export function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// ── Query builder ───────────────────────────────────────

/**
 * Thenable chain mirroring the postgrest builder.
 *
 * Every method returns `this`, and `then` resolves through the active handler -
 * which is what lets `.select().eq().single()` and `.update().eq()` both be
 * awaited without the builder knowing which shape it is.
 */
class MockQueryBuilder implements PromiseLike<MockQueryResult> {
  private call: MockQueryCall;
  private getHandler: () => MockQueryHandler;

  constructor(table: string, getHandler: () => MockQueryHandler) {
    this.call = { table, operation: "select", filters: [], single: false };
    this.getHandler = getHandler;
  }

  select(columns?: string) {
    this.call.operation = "select";
    this.call.columns = columns;
    return this;
  }

  update(payload: unknown) {
    this.call.operation = "update";
    this.call.payload = payload;
    return this;
  }

  insert(payload: unknown) {
    this.call.operation = "insert";
    this.call.payload = payload;
    return this;
  }

  delete() {
    this.call.operation = "delete";
    return this;
  }

  eq(column: string, value: unknown) {
    this.call.filters.push({ column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.call.order = { column, ascending: options?.ascending ?? true };
    return this;
  }

  single() {
    this.call.single = true;
    return this;
  }

  maybeSingle() {
    this.call.single = true;
    return this;
  }

  then<TResult1 = MockQueryResult, TResult2 = never>(
    onfulfilled?:
      ((value: MockQueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.getHandler()(this.call)).then(
      onfulfilled,
      onrejected,
    );
  }
}

// ── Mock ────────────────────────────────────────────────

const OK: MockQueryResult = { data: null, error: null };

function createControls() {
  let authListener:
    ((event: MockAuthEvent, session: MockSession | null) => void) | null = null;
  let initialSession: MockSession | null = null;
  let queryHandler: MockQueryHandler = () => OK;
  let functionHandler: MockFunctionHandler = () => ({
    data: { ok: true },
    error: null,
  });

  const authResponses = {
    signInWithPassword: { error: null } as { error: MockAuthError | null },
    signUp: { data: { user: { id: "test-user" } }, error: null } as {
      data: { user: { id: string } | null };
      error: MockAuthError | null;
    },
    signOut: { error: null } as { error: MockAuthError | null },
    resetPasswordForEmail: { error: null } as { error: MockAuthError | null },
    updateUser: { error: null } as { error: MockAuthError | null },
  };

  const unsubscribe = vi.fn();

  const client = {
    auth: {
      onAuthStateChange: vi.fn(
        (cb: (event: MockAuthEvent, session: MockSession | null) => void) => {
          authListener = cb;
          // supabase-js emits INITIAL_SESSION asynchronously after subscribe.
          // AuthProvider never leaves its loading state without it.
          queueMicrotask(() => {
            if (authListener === cb) cb("INITIAL_SESSION", initialSession);
          });
          return { data: { subscription: { unsubscribe } } };
        },
      ),
      signInWithPassword: vi.fn(async () => authResponses.signInWithPassword),
      signUp: vi.fn(async () => authResponses.signUp),
      signOut: vi.fn(async () => authResponses.signOut),
      resetPasswordForEmail: vi.fn(
        async () => authResponses.resetPasswordForEmail,
      ),
      updateUser: vi.fn(async () => authResponses.updateUser),
      getSession: vi.fn(async () => ({
        data: { session: initialSession },
        error: null,
      })),
    },
    from: vi.fn(
      (table: string) => new MockQueryBuilder(table, () => queryHandler),
    ),
    functions: {
      invoke: vi.fn(async (name: string, options?: { body?: unknown }) =>
        functionHandler(name, options?.body),
      ),
    },
  };

  return {
    client,
    auth: authResponses,
    unsubscribe,

    /** Session handed to the listener on subscribe. Set before rendering. */
    setInitialSession(session: MockSession | null) {
      initialSession = session;
    },

    /** Push an auth event to a mounted `AuthProvider`. */
    emitAuthState(event: MockAuthEvent, session: MockSession | null) {
      if (!authListener) {
        throw new Error(
          "emitAuthState called before anything subscribed to onAuthStateChange",
        );
      }
      authListener(event, session);
    },

    /** Replace the handler for `functions.invoke`. */
    setFunctionHandler(handler: MockFunctionHandler) {
      functionHandler = handler;
    },

    /** Replace the handler for every `.from(...)` chain. */
    setQueryHandler(handler: MockQueryHandler) {
      queryHandler = handler;
    },

    /** Resolve every query with a fixed result. */
    resolveQueries(result: MockQueryResult) {
      queryHandler = () => result;
    },

    /**
     * Hold every matching query open until the returned deferred is settled.
     *
     * This is the hook for the login redirect race: sign-in resolves while the
     * profile fetch is still pending, which is precisely when `ProtectedRoute`
     * currently bounces an authenticated user back to `/login`.
     */
    deferQuery(match?: (call: MockQueryCall) => boolean) {
      const d = deferred<MockQueryResult>();
      queryHandler = (call) => (!match || match(call) ? d.promise : OK);
      return d;
    },

    reset() {
      authListener = null;
      initialSession = null;
      queryHandler = () => OK;
      functionHandler = () => ({ data: { ok: true }, error: null });
      authResponses.signInWithPassword = { error: null };
      authResponses.signUp = {
        data: { user: { id: "test-user" } },
        error: null,
      };
      authResponses.signOut = { error: null };
      authResponses.resetPasswordForEmail = { error: null };
      authResponses.updateUser = { error: null };
      unsubscribe.mockClear();
      client.auth.onAuthStateChange.mockClear();
      client.auth.signInWithPassword.mockClear();
      client.auth.signUp.mockClear();
      client.auth.signOut.mockClear();
      client.auth.resetPasswordForEmail.mockClear();
      client.auth.updateUser.mockClear();
      client.from.mockClear();
      client.functions.invoke.mockClear();
    },
  };
}

export type SupabaseMock = ReturnType<typeof createControls>;

/**
 * Singleton control surface.
 *
 * A singleton rather than a factory because `vi.mock` is hoisted above imports,
 * so the module replacing `@/lib/supabase` has to expose a client that already
 * exists. `setup.ts` resets it between tests.
 */
export const supabaseMock: SupabaseMock = createControls();

// ── Fixtures ────────────────────────────────────────────

export function makeSession(
  overrides: Partial<{ id: string; email: string }> = {},
): MockSession {
  return {
    user: {
      id: overrides.id ?? "user-1",
      email: overrides.email ?? "deltagare@boostbyfcr.se",
    },
  };
}

export interface MockProfile {
  id: string;
  full_name: string | null;
  email?: string;
  approved: boolean;
  is_admin: boolean;
}

export function makeProfile(overrides: Partial<MockProfile> = {}): MockProfile {
  return {
    id: overrides.id ?? "user-1",
    full_name: overrides.full_name ?? "Test Testsson",
    email: overrides.email ?? "deltagare@boostbyfcr.se",
    approved: overrides.approved ?? true,
    is_admin: overrides.is_admin ?? false,
  };
}

/** Signed in, profile approved - the ordinary authenticated case. */
export function signedInAs(profile: Partial<MockProfile> = {}) {
  const full = makeProfile(profile);
  supabaseMock.setInitialSession(
    makeSession({ id: full.id, email: full.email }),
  );
  supabaseMock.resolveQueries({ data: full, error: null });
  return full;
}
