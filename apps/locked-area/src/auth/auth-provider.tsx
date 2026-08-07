import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { translateAuthError } from "@/lib/auth-errors";
import { AuthContext, type Profile } from "@/auth/auth-context";

const GENERIC_ERROR = "Ett fel uppstod. Försök igen.";
const PROFILE_ERROR =
  "Kunde inte hämta din profil. Kontrollera din anslutning och försök igen.";
const TIMEOUT_ERROR =
  "Det tog för lång tid att kontrollera din inloggning. Kontrollera din anslutning och försök igen.";

/**
 * Upper bound on time spent in the loading state.
 *
 * Two things here can stall indefinitely, and neither carries a timeout of its
 * own: the `profiles` query, if the connection drops mid-request, and the
 * `SIGNED_IN` event that `login` hands off to. Without a bound either one
 * leaves the member on a spinner with no way back to a working screen.
 *
 * Deliberately generous. A spurious timeout on a slow connection is worse than
 * a few more seconds of spinner, and a healthy round-trip is well under a
 * second.
 */
export const AUTH_TIMEOUT_MS = 15_000;

/**
 * Owns the session lifecycle and exposes the auth operations.
 *
 * Must be rendered inside a router: `logout` navigates rather than assigning
 * to `window.location`, which previously tore down and reloaded the whole SPA.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const navigate = useNavigate();

  // Guards every state write, including those after an await. The previous
  // `let isMounted` only covered the synchronous callback body, so a profile
  // fetch that resolved after unmount still wrote state.
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Watchdog on the loading state itself, rather than on either of the two
  // things that can stall. `login` sets isLoading before the SIGNED_IN event
  // arrives and fetchProfile keeps it set across the query, so a single timer
  // spanning both covers the whole sign-in path. Re-setting isLoading to true
  // while it is already true is a no-op in React, so the timer is not
  // restarted midway and genuinely bounds the entire flow.
  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      if (!isMounted.current) return;
      setIsLoading(false);
      setProfileError(TIMEOUT_ERROR);
    }, AUTH_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [isLoading]);

  /** Load the member's row from `profiles` for an established session. */
  const fetchProfile = useCallback(
    async (userId: string, email: string | undefined) => {
      // Set before awaiting. A consumer that renders between the session
      // arriving and the profile landing must see "loading", not "logged out" -
      // that gap is what previously bounced a freshly authenticated user
      // back to /login.
      if (isMounted.current) {
        setIsLoading(true);
        setProfileError(null);
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, approved, is_admin")
          .eq("id", userId)
          .single();

        if (!isMounted.current) return;

        if (error || !data) {
          // A reachable session with an unreadable profile is a failure, not a
          // logout. Reporting it as "unauthenticated" would silently redirect
          // the member to the login screen with nothing explaining why.
          console.error("Profile fetch error:", error);
          setUser(null);
          setProfileError(PROFILE_ERROR);
        } else {
          setUser({ ...(data as Omit<Profile, "email">), email: email ?? "" });
          setProfileError(null);
        }
      } catch (err) {
        if (!isMounted.current) return;
        console.error("Profile fetch failed:", err);
        setUser(null);
        setProfileError(PROFILE_ERROR);
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    },
    [],
  );

  // Single subscription; supabase-js emits INITIAL_SESSION on subscribe, so
  // there is no need for a separate getSession() call that would double-fire.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted.current) return;
      setHasSession(Boolean(session?.user));
      if (session?.user) {
        void fetchProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setProfileError(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── Login ───────────────────────────────────────────

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: translateAuthError(error.message) };
      }

      // Enter the loading state here rather than waiting for onAuthStateChange.
      // The caller navigates to a protected route the moment this resolves, and
      // whether the SIGNED_IN event has been dispatched by then is not
      // guaranteed. Setting it synchronously closes the window entirely instead
      // of narrowing it.
      if (isMounted.current) setIsLoading(true);

      return { success: true };
    } catch {
      return { success: false, error: GENERIC_ERROR };
    }
  };

  // ── Register ────────────────────────────────────────

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        return { success: false, error: translateAuthError(error.message) };
      }

      if (!data.user) {
        return {
          success: false,
          error: "Kunde inte skapa konto. Försök igen.",
        };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: "Ett fel uppstod. Försök igen om en stund.",
      };
    }
  };

  // ── Reset Password ───────────────────────────────────

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: translateAuthError(error.message) };
      }

      return { success: true };
    } catch {
      return { success: false, error: GENERIC_ERROR };
    }
  };

  // ── Update password ─────────────────────────────────

  // Lives here rather than in the page so that reset-password does not reach
  // for the supabase singleton directly, and so its failures go through the
  // same Swedish translation as every other auth error - the page previously
  // rendered Supabase's raw English message.
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        return { success: false, error: translateAuthError(error.message) };
      }

      return { success: true };
    } catch {
      return { success: false, error: GENERIC_ERROR };
    }
  };

  // ── Logout ──────────────────────────────────────────

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }

    if (isMounted.current) {
      setUser(null);
      setProfileError(null);
      setHasSession(false);
      setIsLoading(false);
    }
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin ?? false,
        isLoading,
        profileError,
        hasSession,
        login,
        register,
        resetPassword,
        updatePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
