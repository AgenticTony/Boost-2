import { Navigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/auth/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, profileError } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface text-text">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-navy/20 border-t-brand-navy mx-auto" />
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
      <div className="flex items-center justify-center min-h-screen bg-surface text-text p-6">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-red-light text-brand-red mb-6">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-3">
            Kunde inte ladda din profil
          </h1>
          <p className="text-text-muted leading-relaxed mb-8">{profileError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-cta font-display font-semibold bg-brand-red text-white hover:bg-brand-red/90 transition-colors"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  // Not logged in → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not approved yet → show pending message
  if (user && !user.approved) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface text-text p-6">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 text-amber-600 mb-6">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text mb-3">
            Konto väntar på godkännande
          </h1>
          <p className="text-text-muted leading-relaxed">
            Ditt konto har skapats men måste godkännas av en administratör innan
            du får tillgång till materialet.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
