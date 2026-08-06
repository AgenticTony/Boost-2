import { type ReactElement, type ReactNode } from "react";
import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/auth/auth-provider";

/**
 * Provider stack for component and page tests.
 *
 * The nesting order mirrors `main.tsx` exactly and must keep doing so - a test
 * that wraps providers differently from production can pass while the app is
 * broken. `AuthProvider` currently sits *outside* the router, which is why
 * `logout` falls back to `window.location.href`; Phase 3 moves it inside and
 * updates both files together.
 */
export function createWrapper(initialEntries: string[] = ["/"]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <HelmetProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </AuthProvider>
      </HelmetProvider>
    );
  };
}

export interface RenderWithProvidersOptions extends Omit<
  RenderOptions,
  "wrapper"
> {
  /** Initial route for the MemoryRouter. Defaults to `"/"`. */
  route?: string;
  /** Full history stack, when a test needs more than one entry. */
  routes?: string[];
}

/**
 * Render `ui` inside the full provider stack.
 *
 * Seed auth state through `supabaseMock` *before* calling this - `AuthProvider`
 * reads it during mount, via the `INITIAL_SESSION` event the mock emits on
 * subscribe.
 *
 * @example
 *   signedInAs({ is_admin: true });
 *   renderWithProviders(<Header />);
 *   expect(await screen.findByText("Admin")).toBeInTheDocument();
 */
export function renderWithProviders(
  ui: ReactElement,
  { route, routes, ...options }: RenderWithProvidersOptions = {},
): RenderResult {
  const entries = routes ?? [route ?? "/"];
  return render(ui, { wrapper: createWrapper(entries), ...options });
}
