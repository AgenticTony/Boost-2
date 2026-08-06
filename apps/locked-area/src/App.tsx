import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/login";

// Lazy-load non-critical pages for code splitting
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));
const Library = lazy(() => import("@/pages/Library"));
const ExerciseDetail = lazy(() => import("@/pages/ExerciseDetail"));
const Resources = lazy(() => import("@/pages/Resources"));
const HandbookReader = lazy(() => import("@/pages/HandbookReader"));
const KnowledgeSection = lazy(() => import("@/pages/KnowledgeSection"));
const AdminApprovals = lazy(() => import("@/pages/AdminApprovals"));

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
