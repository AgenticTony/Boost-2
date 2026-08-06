import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/auth/AuthContext";

/**
 * Wraps children with the providers needed for component/page tests.
 * Uses MemoryRouter so tests can set initial route.
 */
export function createWrapper(initialEntries: string[] = ["/"]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <HelmetProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </AuthProvider>
      </HelmetProvider>
    );
  };
}
