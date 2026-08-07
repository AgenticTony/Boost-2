import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AlertTriangle, Clock, type LucideIcon } from "lucide-react";
import { useAuth } from "@/auth/use-auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface ProtectedRouteProps {
  children: ReactNode;
}

/** Centred full-height panel shared by the guard's three blocking states. */
function GateScreen({
  icon: Icon,
  iconClassName,
  title,
  children,
  action,
}: {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface text-text p-6">
      <div className="max-w-md text-center">
        <div
          className={cn(
            "inline-flex items-center justify-center h-16 w-16 rounded-full mb-6",
            iconClassName,
          )}
        >
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-display font-bold text-text mb-3">
          {title}
        </h1>
        <p className="text-text-muted leading-relaxed">{children}</p>
        {action && <div className="mt-8">{action}</div>}
      </div>
    </div>
  );
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, profileError } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface text-text">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" label="Laddar" />
          <p className="mt-4 text-text-muted">Laddar...</p>
        </div>
      </div>
    );
  }

  // Session is valid but the profile could not be read. Redirecting here would
  // dump the member on the login screen with nothing explaining why, and they
  // would appear to be signed out despite holding a live session.
  if (profileError) {
    return (
      <GateScreen
        icon={AlertTriangle}
        iconClassName="bg-brand-red-light text-brand-red"
        title="Kunde inte ladda din profil"
        action={
          <Button size="lg" onClick={() => window.location.reload()}>
            Försök igen
          </Button>
        }
      >
        {profileError}
      </GateScreen>
    );
  }

  // Not logged in → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not approved yet → show pending message
  if (user && !user.approved) {
    return (
      <GateScreen
        icon={Clock}
        iconClassName="bg-brand-gold/15 text-brand-gold"
        title="Konto väntar på godkännande"
      >
        Ditt konto har skapats men måste godkännas av en administratör innan du
        får tillgång till materialet.
      </GateScreen>
    );
  }

  return <>{children}</>;
};
