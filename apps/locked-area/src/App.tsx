import { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ErrorBoundary } from "@/components/error-boundary";
import { ProtectedRoute } from "@/components/protected-route";
import { AppLayout } from "@/components/layout/app-layout";
import { LoadingState } from "@/components/ui/spinner";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";

// Lazy-load non-critical pages for code splitting. Login stays eager: it is
// the first screen for every unauthenticated visitor.
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const VerifyEmail = lazy(() => import("@/pages/verify-email"));
const Library = lazy(() => import("@/pages/library"));
const ExerciseDetail = lazy(() => import("@/pages/exercise-detail"));
const Resources = lazy(() => import("@/pages/resources"));
const HandbookReader = lazy(() => import("@/pages/handbook-reader"));
const KnowledgeSection = lazy(() => import("@/pages/knowledge-section"));
const AdminApprovals = lazy(() => import("@/pages/admin-approvals"));

function PageLoader() {
  return (
    <LoadingState size="lg" className="min-h-[60vh]" label="Laddar sidan" />
  );
}

/** Bare chrome for the auth screens - no header, no nav. */
function AuthLayout() {
  return <Outlet />;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <ScrollToTop />
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Unauthenticated screens */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
              </Route>

              {/* Member area */}
              <Route element={<AppLayout />}>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Library />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources"
                  element={
                    <ProtectedRoute>
                      <Resources />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exercise/:id"
                  element={
                    <ProtectedRoute>
                      <ExerciseDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/handbook"
                  element={
                    <ProtectedRoute>
                      <HandbookReader />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/knowledge"
                  element={
                    <ProtectedRoute>
                      <KnowledgeSection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/approvals"
                  element={
                    <ProtectedRoute>
                      <AdminApprovals />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
