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
