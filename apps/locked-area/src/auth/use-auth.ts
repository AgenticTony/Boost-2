import { useContext } from "react";
import { AuthContext } from "@/auth/auth-context";

/**
 * Access the current auth state and operations.
 *
 * @throws If called outside an `AuthProvider`.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
