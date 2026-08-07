import { createContext } from "react";

/** A member's profile row from `public.profiles`, joined with their auth email. */
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  approved: boolean;
  is_admin: boolean;
}

export interface AuthContextValue {
  user: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  /**
   * Set when a session exists but its profile row could not be read.
   *
   * Distinct from `!isAuthenticated`: that means "no session", this means
   * "session, but we cannot tell who you are". Treating the second as the
   * first redirects a signed-in member to the login screen with no explanation.
   */
  profileError: string | null;
  /**
   * Whether a Supabase session exists at all, independent of whether its
   * profile row loaded or the account is approved.
   *
   * `isAuthenticated` is not a substitute: a password-recovery link produces a
   * real session for someone whose profile may not be readable yet, and
   * /reset-password has to tell that apart from an expired link.
   */
  hasSession: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  /** Set a new password for the session established by a recovery link. */
  updatePassword: (
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

/**
 * Auth context object.
 *
 * Deliberately kept in a JSX-free module so that neither the provider component
 * nor the `useAuth` hook has to export a non-component alongside a component -
 * which is what previously required a `react-refresh/only-export-components`
 * suppression.
 */
export const AuthContext = createContext<AuthContextValue | null>(null);
