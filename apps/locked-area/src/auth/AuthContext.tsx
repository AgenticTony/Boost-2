import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user's profile from the profiles table
  async function fetchProfile(userId: string, email: string | undefined) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, approved, is_admin")
      .eq("id", userId)
      .single();

    if (data) {
      setUser({
        ...data,
        email: email ?? "",
      });
    } else {
      // Profile doesn't exist yet (shouldn't happen — trigger creates it)
      setUser(null);
    }
    setIsLoading(false);
  }

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Listen for changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Login ───────────────────────────────────────────

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: "Felaktig e-post eller lösenord" };
      }

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
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
        return { success: false, error: translateError(error.message) };
      }

      if (!data.user) {
        return { success: false, error: "Kunde inte skapa konto. Försök igen." };
      }

      return { success: true };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, error: "Ett fel uppstod. Försök igen om en stund." };
    }
  };

  // ── Reset Password ───────────────────────────────────

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, error: "Kunde inte skicka återställningslänk." };
    }

    return { success: true };
  };

  // ── Logout ──────────────────────────────────────────

  const logout = async () => {
    await supabase.auth.signOut();
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

// ── Error translation ────────────────────────────────────

function translateError(message: string): string {
  if (message.includes("already registered")) return "E-postadressen är redan registrerad";
  if (message.includes("Password should be")) return "Lösenordet är för svagt (minst 6 tecken)";
  if (message.includes("Invalid email")) return "Ogiltig e-postadress";
  return "Ett fel uppstod. Försök igen.";
}

// ── Hook ────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
