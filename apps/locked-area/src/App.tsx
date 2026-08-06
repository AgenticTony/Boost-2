import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ErrorBoundary } from "@/components/error-boundary";
import { ProtectedRoute } from "@/components/protected-route";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";

// Lazy-load non-critical pages for code splitting
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
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy" />
    </div>
  );
}

// Routes where the header should not appear
const AUTH_ROUTES = ["/login", "/forgot-password", "/reset-password", "/verify-email"];

export default function App() {
  const pathname = window.location.pathname;
  const showHeader = !AUTH_ROUTES.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <ScrollToTop />
      {showHeader && <Header />}
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/" element={<ProtectedRoute><Library /></ProtectedRoute>} />
              <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
              <Route path="/exercise/:id" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
              <Route path="/exercises" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
              <Route path="/handbook" element={<ProtectedRoute><HandbookReader /></ProtectedRoute>} />
              <Route path="/knowledge" element={<ProtectedRoute><KnowledgeSection /></ProtectedRoute>} />
              <Route path="/admin/approvals" element={<ProtectedRoute><AdminApprovals /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
