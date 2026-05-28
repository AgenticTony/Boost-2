import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { ScrollToTop } from "@/components/scroll-to-top";

/* Eager - the home page is the primary landing page, so it ships in the main
 * bundle. This lets the hero paint on first render instead of after the lazy
 * chunk loads + hydrates (was the LCP bottleneck at ~4.1s). All other routes
 * stay code-split. */
import HomePage from "@/pages/home";
import NotFoundPage from "@/pages/not-found";

/* Lazy - code-split per route */
const AnmalDigPage = lazy(() => import("@/pages/anmal-dig"));
const AnmalDig2Page = lazy(() => import("@/pages/anmal-dig2"));
const ArbetssokandePage = lazy(() => import("@/pages/arbetssokande"));
const BridgePage = lazy(() => import("@/pages/bridge"));
const CookiepolicyPage = lazy(() => import("@/pages/cookiepolicy"));
const DataskyddspolicyPage = lazy(() => import("@/pages/dataskyddspolicy"));
const ForetagPage = lazy(() => import("@/pages/foretag"));
const HalsosparetPage = lazy(() => import("@/pages/halsosparet"));
const KontaktPage = lazy(() => import("@/pages/kontakt"));
const LedigaTjansterPage = lazy(() => import("@/pages/lediga-tjanster"));
const NyheterPage = lazy(() => import("@/pages/nyheter"));
const NyheterSlugPage = lazy(() => import("@/pages/nyheter-slug"));
const PressMediaPage = lazy(() => import("@/pages/press-media"));
const ResurserPage = lazy(() => import("@/pages/resurser"));
const StudierPage = lazy(() => import("@/pages/studier"));
const VadViGorPage = lazy(() => import("@/pages/vad-vi-gor"));
const VarHistoriaPage = lazy(() => import("@/pages/var-historia"));
const VanligaFragorPage = lazy(() => import("@/pages/vanliga-fragor"));
const VemViArPage = lazy(() => import("@/pages/vem-vi-ar"));

function PageLoader() {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Skeleton hero */}
        <div className="space-y-4">
          <div className="h-3 w-24 rounded-full bg-muted animate-pulse" />
          <div className="h-10 w-3/4 rounded-lg bg-muted animate-pulse" />
          <div className="h-5 w-full rounded-lg bg-muted animate-pulse" />
          <div className="h-5 w-2/3 rounded-lg bg-muted animate-pulse" />
        </div>
        {/* Skeleton content */}
        <div className="space-y-4">
          <div className="h-4 w-full rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-5/6 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-4/6 rounded-lg bg-muted animate-pulse" />
        </div>
        {/* Skeleton cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-2xl bg-muted/50 p-6 space-y-4 animate-pulse"
            >
              <div className="h-12 w-12 rounded-xl bg-muted" />
              <div className="h-5 w-2/3 rounded-lg bg-muted" />
              <div className="h-4 w-full rounded-lg bg-muted" />
              <div className="h-4 w-4/5 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/anmal-dig" element={<AnmalDigPage />} />
              <Route path="/anmal-dig2" element={<AnmalDig2Page />} />
              <Route path="/arbetssokande" element={<ArbetssokandePage />} />
              <Route path="/bridge" element={<BridgePage />} />
              <Route
                path="/cookiepolicy"
                element={<CookiepolicyPage />}
              />
              <Route
                path="/dataskyddspolicy"
                element={<DataskyddspolicyPage />}
              />
              <Route path="/foretag" element={<ForetagPage />} />
              <Route path="/halsosparet" element={<HalsosparetPage />} />
              <Route path="/kontakt" element={<KontaktPage />} />
              <Route path="/lediga-tjanster" element={<LedigaTjansterPage />} />
              <Route path="/nyheter" element={<NyheterPage />} />
              <Route path="/nyheter/:slug" element={<NyheterSlugPage />} />
              <Route path="/press-media" element={<PressMediaPage />} />
              <Route path="/resurser" element={<ResurserPage />} />
              <Route path="/studier" element={<StudierPage />} />
              <Route path="/vad-vi-gor" element={<VadViGorPage />} />
              <Route path="/var-historia" element={<VarHistoriaPage />} />
              <Route path="/vanliga-fragor" element={<VanligaFragorPage />} />
              <Route path="/vem-vi-ar" element={<VemViArPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
