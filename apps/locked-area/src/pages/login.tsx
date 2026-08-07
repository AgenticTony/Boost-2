import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/auth/use-auth";
import { AuthHero } from "@/components/auth/auth-hero";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

/** Where "back to the main site" points. */
const PUBLIC_SITE_URL = "https://boostbyfcr.se";

const TABS = [
  { id: "login", label: "Logga in", heading: "Metodmaterial" },
  { id: "register", label: "Skapa konto", heading: "Skapa konto" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SUBHEADINGS: Record<TabId, string> = {
  login: "Logga in för att komma åt övningar, handbok och kunskapsmaterial",
  register: "Fyll i dina uppgifter för att skapa ett konto",
};

export default function Login() {
  const { isAuthenticated, isLoading: isSessionLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("login");
  const [notice, setNotice] = useState("");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectTab = (id: TabId) => {
    setActiveTab(id);
    setNotice("");
  };

  /**
   * Arrow-key navigation, which the tab role implies and screen-reader users
   * expect. The previous markup declared role="tablist"/role="tab" but wired
   * up neither keyboard support nor tab panels - announcing a widget it did
   * not actually implement, which is worse than plain buttons.
   */
  const onTabKeyDown = (event: React.KeyboardEvent) => {
    const order = TABS.map((t) => t.id);
    const current = order.indexOf(activeTab);

    let next: TabId | undefined;
    if (event.key === "ArrowRight") next = order[(current + 1) % order.length];
    if (event.key === "ArrowLeft")
      next = order[(current - 1 + order.length) % order.length];
    if (event.key === "Home") next = order[0];
    if (event.key === "End") next = order[order.length - 1];

    if (next) {
      event.preventDefault();
      selectTab(next);
      tabRefs.current[next]?.focus();
    }
  };

  // An authenticated visitor has no business on the login screen. Without this
  // they could end up stranded here holding a live session, with the form
  // offering to sign them in again.
  if (isAuthenticated && !isSessionLoading) {
    return <Navigate to="/" replace />;
  }

  const heading = TABS.find((t) => t.id === activeTab)!.heading;

  return (
    <div className="min-h-screen flex font-body">
      <AuthHero />

      <div className="w-full lg:w-1/2 bg-surface flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-card border border-border p-8 shadow-md">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-input bg-brand-red/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-brand-red" aria-hidden="true" />
              </div>
            </div>

            <h2 className="text-2xl font-display font-bold text-text text-center mb-2">
              {heading}
            </h2>
            <p className="text-text-muted text-center text-sm mb-6">
              {SUBHEADINGS[activeTab]}
            </p>

            <div
              className="flex border-b border-border mb-6"
              role="tablist"
              aria-label="Inloggning eller registrering"
            >
              {TABS.map((tab) => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[tab.id] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectTab(tab.id)}
                    onKeyDown={onTabKeyDown}
                    className={cn(
                      "flex-1 py-3 text-sm font-medium transition-all",
                      selected
                        ? "text-brand-red border-b-2 border-brand-red"
                        : "text-text-muted hover:text-text",
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {notice && (
              <div className="mb-4">
                <Alert variant="success">{notice}</Alert>
              </div>
            )}

            <div
              role="tabpanel"
              id="panel-login"
              aria-labelledby="tab-login"
              hidden={activeTab !== "login"}
            >
              {activeTab === "login" && (
                <LoginForm onRegisterClick={() => selectTab("register")} />
              )}
            </div>

            <div
              role="tabpanel"
              id="panel-register"
              aria-labelledby="tab-register"
              hidden={activeTab !== "register"}
            >
              {activeTab === "register" && (
                <RegisterForm
                  onLoginClick={() => selectTab("login")}
                  onSuccess={(message) => {
                    setActiveTab("login");
                    setNotice(message);
                  }}
                />
              )}
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-brand-gold text-lg" aria-hidden="true">
                ✦
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <a
              href={PUBLIC_SITE_URL}
              className="flex items-center justify-center gap-2 text-text-muted hover:text-text text-sm transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />
              Tillbaka till startsidan
            </a>
          </div>

          <p className="text-center text-xs text-text-muted mt-6">
            Boost by FC Rosengård — Metodmaterial för deltagare
          </p>
        </div>
      </div>
    </div>
  );
}
