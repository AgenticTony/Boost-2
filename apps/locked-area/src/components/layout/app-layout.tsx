import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/auth/use-auth";

/**
 * Chrome for the signed-in area.
 *
 * Header and footer are keyed off authentication rather than a list of paths.
 * The previous approach read `window.location.pathname` during render in
 * App.tsx, which never updated on client-side navigation - so the
 * authenticated header, including the logout button and the member's email,
 * stayed mounted over the login screen.
 *
 * The same flag hides both from a signed-out visitor who lands on an unknown
 * URL: a 404 is the one member-area route reachable without a session, and
 * wrapping it in member navigation would be misleading.
 */
export function AppLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-1 flex-col">
      {isAuthenticated && <Header />}
      <div className="flex-1">
        <Outlet />
      </div>
      {isAuthenticated && <Footer />}
    </div>
  );
}
