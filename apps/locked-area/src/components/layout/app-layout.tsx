import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/auth/use-auth";

/**
 * Chrome for the signed-in area.
 *
 * The header is keyed off authentication rather than a list of paths. The
 * previous approach read `window.location.pathname` during render in App.tsx,
 * which never updated on client-side navigation - so the authenticated header,
 * including the logout button and the member's email, stayed mounted over the
 * login screen.
 */
export function AppLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Header />}
      <Outlet />
    </>
  );
}
