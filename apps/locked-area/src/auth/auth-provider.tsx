import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { translateAuthError } from "@/lib/auth-errors";

// ── Types ───────────────────────────────────────────────

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  approved: boolean;
  is_admin: boolean;
}

interface AuthContextValue {
  user: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user's profile from the profiles table
  async function fetchProfile(userId: string, email: string | undefined) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, approved, is_admin")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        setUser(null);
      } else if (data) {
        setUser({
          ...data,
          email: email ?? "",
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
      setUser(null);
    }
    setIsLoading(false);
  }

  // Listen for auth state changes (single subscription, no getSession double-fire)
  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

      return { success: true };
    } catch {
      return { success: false, error: "Ett fel uppstod. Försök igen." };
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
        return { success: false, error: "Kunde inte skapa konto. Försök igen." };
      }

      return { success: true };
    } catch {
      return { success: false, error: "Ett fel uppstod. Försök igen om en stund." };
    }
  };

  // ── Reset Password ───────────────────────────────────

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, error: translateAuthError(error.message) };
    }

    return { success: true };
  };

  // ── Logout ──────────────────────────────────────────

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin ?? false,
        isLoading,
        login,
        register,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
