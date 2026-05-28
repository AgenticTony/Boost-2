import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Briefcase,
  Heart,
  UsersRound,
  Newspaper,
  BriefcaseMedical,
  Clock,
  PenLine,
  Phone,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* Anna's requested nav order: Arbetssökande, Arbetsgivare, Skolor, Om oss, Mer */
const jobSeekerLinks = [
  {
    href: "/arbetssokande",
    label: "Arbetsspåret",
    icon: Briefcase,
    iconColor: "text-white",
  },
  {
    href: "/halsosparet",
    label: "Hälsospåret",
    icon: Heart,
    iconColor: "text-white",
  },
  {
    href: "/bridge",
    label: "Bridge by FCR",
    icon: PenLine,
    iconColor: "text-white",
  },
];

const aboutLinks = [
  {
    href: "/vem-vi-ar",
    label: "Om oss",
    icon: UsersRound,
    iconColor: "text-white",
  },
  {
    href: "/var-historia",
    label: "Vår historia",
    icon: Clock,
    iconColor: "text-white",
  },
  {
    href: "/press-media",
    label: "Press & media",
    icon: Newspaper,
    iconColor: "text-white",
  },
  {
    href: "/lediga-tjanster",
    label: "Lediga tjänster",
    icon: BriefcaseMedical,
    iconColor: "text-white",
  },
];

/* "Mer" dropdown - Nyheter, Kontakt */
const moreLinks = [
  {
    href: "/nyheter",
    label: "Nyheter",
    icon: Newspaper,
    iconColor: "text-white",
  },
  {
    href: "/kontakt",
    label: "Kontakt",
    icon: Phone,
    iconColor: "text-white",
  },
];

type DropdownId = "job-seeker" | "about" | "more";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownId | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const drawerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  /** Focus the first link inside a dropdown panel after it opens. */
  const focusDropdownItem = useCallback((id: DropdownId) => {
    requestAnimationFrame(() => {
      const panel = document.getElementById(`dropdown-${id}`);
      const firstLink = panel?.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
    });
  }, []);

  function handleDropdownKey(e: React.KeyboardEvent, dropdown: DropdownId) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const isOpening = activeDropdown !== dropdown;
      setActiveDropdown(isOpening ? dropdown : null);
      if (isOpening) focusDropdownItem(dropdown);
    }
    if (e.key === "Escape") {
      setActiveDropdown(null);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const isOpening = activeDropdown !== dropdown;
      setActiveDropdown(isOpening ? dropdown : null);
      if (isOpening) focusDropdownItem(dropdown);
    }
  }

  function handlePanelKeyDown(e: React.KeyboardEvent, id: DropdownId) {
    if (e.key === "Escape") {
      setActiveDropdown(null);
      const btn = document.querySelector<HTMLButtonElement>(
        `[aria-controls="dropdown-${id}"]`,
      );
      btn?.focus();
    }
    if (e.key === "Tab") {
      setActiveDropdown(null);
    }
  }

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => {
        firstFocusableRef.current?.focus();
      });
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen || !drawerRef.current) return;

    function handleDrawerKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusable = drawer.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleDrawerKey);
    return () => document.removeEventListener("keydown", handleDrawerKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeMobile();
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [mobileOpen, closeMobile]);

  return (
    <header className="sticky top-0 z-50 bg-[#0A1929]/95 backdrop-blur-md shadow-lg border-b border-white/10">
      <a href="#main-content" className="skip-to-content">
        Hoppa till huvudinnehåll
      </a>
      <nav className="w-full max-w-[1440px] mx-auto px-4 lg:px-6 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/logo_boostbyfcr_dark.webp"
            alt="Boost by FC Rosengård"
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Arbetssökande */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("job-seeker")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center">
              <Link
                to="/arbetssokande"
                className="px-1.5 py-2 text-sm font-medium whitespace-nowrap text-white/80 hover:text-[#D4AF37] transition-colors rounded-md hover:bg-white/10"
              >
                Arbetssökande
              </Link>
              <button
                className="px-1.5 py-2 text-white/80 hover:text-[#D4AF37] transition-colors"
                aria-expanded={activeDropdown === "job-seeker"}
                aria-haspopup="true"
                aria-controls="dropdown-job-seeker"
                aria-label="Arbetssökande undermeny"
                onKeyDown={(e) => handleDropdownKey(e, "job-seeker")}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <AnimatePresence>
              {activeDropdown === "job-seeker" && (
                <motion.div
                  id="dropdown-job-seeker"
                  role="menu"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                  className="absolute top-full left-0 mt-1 w-64 bg-[#0A1929]/95 backdrop-blur-md rounded-card shadow-lg border border-white/10 p-2"
                  onKeyDown={(e) => handlePanelKeyDown(e, "job-seeker")}
                >
                  {jobSeekerLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      role="menuitem"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/80 hover:text-[#D4AF37] hover:bg-white/10 transition-colors"
                    >
                      <link.icon className={`h-5 w-5 ${link.iconColor}`} />
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/foretag"
            className="px-2 py-2 text-sm font-medium whitespace-nowrap text-white/80 hover:text-[#D4AF37] transition-colors rounded-md hover:bg-white/10"
          >
            Arbetsgivare
          </Link>

          <Link
            to="/studier"
            className="px-2 py-2 text-sm font-medium whitespace-nowrap text-white/80 hover:text-[#D4AF37] transition-colors rounded-md hover:bg-white/10"
          >
            Skolor och utbildningsanordnare
          </Link>

          <Link
            to="/vad-vi-gor"
            className="px-2 py-2 text-sm font-medium whitespace-nowrap text-white/80 hover:text-[#D4AF37] transition-colors rounded-md hover:bg-white/10"
          >
            Vårt arbetssätt
          </Link>

          {/* Om oss */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("about")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center">
              <Link
                to="/vem-vi-ar"
                className="px-1.5 py-2 text-sm font-medium whitespace-nowrap text-white/80 hover:text-[#D4AF37] transition-colors rounded-md hover:bg-white/10"
              >
                Om oss
              </Link>
              <button
                className="px-1.5 py-2 text-white/80 hover:text-[#D4AF37] transition-colors"
                aria-expanded={activeDropdown === "about"}
                aria-haspopup="true"
                aria-controls="dropdown-about"
                aria-label="Om oss undermeny"
                onKeyDown={(e) => handleDropdownKey(e, "about")}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <AnimatePresence>
              {activeDropdown === "about" && (
                <motion.div
                  id="dropdown-about"
                  role="menu"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                  className="absolute top-full left-0 mt-1 w-52 bg-[#0A1929]/95 backdrop-blur-md rounded-card shadow-lg border border-white/10 p-2"
                  onKeyDown={(e) => handlePanelKeyDown(e, "about")}
                >
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      role="menuitem"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/80 hover:text-[#D4AF37] hover:bg-white/10 transition-colors"
                    >
                      <link.icon className={`h-5 w-5 ${link.iconColor}`} />
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mer */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("more")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium whitespace-nowrap text-white/80 hover:text-[#D4AF37] transition-colors rounded-md hover:bg-white/10"
              aria-expanded={activeDropdown === "more"}
              aria-haspopup="true"
              aria-controls="dropdown-more"
              onKeyDown={(e) => handleDropdownKey(e, "more")}
            >
              Mer
              <ChevronDown className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {activeDropdown === "more" && (
                <motion.div
                  id="dropdown-more"
                  role="menu"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                  className="absolute top-full right-0 mt-1 w-52 bg-[#0A1929]/95 backdrop-blur-md rounded-card shadow-lg border border-white/10 p-2"
                  onKeyDown={(e) => handlePanelKeyDown(e, "more")}
                >
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      role="menuitem"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/80 hover:text-[#D4AF37] hover:bg-white/10 transition-colors"
                    >
                      <link.icon className={`h-5 w-5 ${link.iconColor}`} />
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Anmälan */}
          <Button
            asChild
            className="hidden lg:inline-flex bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-cta px-6"
          >
            <Link to="/anmal-dig2">Anmälan</Link>
          </Button>

          {/* Medlemsarea */}
          <a
            href="https://boost-by-fcr-locked-area.pages.dev/login"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 px-2 py-2 text-sm font-medium whitespace-nowrap text-white/80 hover:text-[#D4AF37] transition-colors rounded-md hover:bg-white/10"
          >
            <Lock className="h-4 w-4" />
            Medlemsarea
          </a>

          {/* Mobile menu toggle */}
          <button
            ref={toggleRef}
            className="lg:hidden p-2 text-white/80 hover:text-[#D4AF37]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={closeMobile}
              aria-hidden="true"
            />
            <motion.aside
              ref={drawerRef}
              initial={prefersReducedMotion ? false : { x: "-100%" }}
              animate={{ x: "0%" }}
              exit={prefersReducedMotion ? undefined : { x: "-100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: prefersReducedMotion ? 0 : undefined,
              }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100dvh",
                width: "85%",
                maxWidth: 360,
                zIndex: 50,
                overflowY: "auto",
                backgroundColor: "#0A1929",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigeringsmeny"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <img
                    src="/images/logo_boostbyfcr_dark.webp"
                    alt="Boost by FC Rosengård"
                    className="h-7 w-auto"
                  />
                  <button
                    ref={firstFocusableRef}
                    onClick={closeMobile}
                    aria-label="Stäng meny"
                  >
                    <X className="h-6 w-6 text-white/80" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Anmälan */}
                  <div>
                    <Link
                      to="/anmal-dig2"
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-[#D4AF37] hover:bg-white/10 transition-colors"
                    >
                      <PenLine className="h-5 w-5 text-[#D4AF37]" />
                      Anmälan
                    </Link>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">
                      Arbetssökande
                    </p>
                    <div className="space-y-1">
                      {jobSeekerLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={closeMobile}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/80 hover:text-[#D4AF37] hover:bg-white/10 transition-colors"
                        >
                          <link.icon className={`h-5 w-5 ${link.iconColor}`} />
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Link
                      to="/foretag"
                      onClick={closeMobile}
                      className="block px-3 py-2.5 text-sm font-medium text-white/80 hover:text-[#D4AF37] hover:bg-white/10 rounded-md transition-colors"
                    >
                      Arbetsgivare
                    </Link>
                  </div>

                  <div>
                    <Link
                      to="/studier"
                      onClick={closeMobile}
                      className="block px-3 py-2.5 text-sm font-medium text-white/80 hover:text-[#D4AF37] hover:bg-white/10 rounded-md transition-colors"
                    >
                      Skolor och utbildningsanordnare
                    </Link>
                  </div>

                  <div>
                    <Link
                      to="/vad-vi-gor"
                      onClick={closeMobile}
                      className="block px-3 py-2.5 text-sm font-medium text-white/80 hover:text-[#D4AF37] hover:bg-white/10 rounded-md transition-colors"
                    >
                      Vårt arbetssätt
                    </Link>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">
                      Om oss
                    </p>
                    <div className="space-y-1">
                      {aboutLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={closeMobile}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/80 hover:text-[#D4AF37] hover:bg-white/10 transition-colors"
                        >
                          <link.icon className={`h-5 w-5 ${link.iconColor}`} />
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">
                      Mer
                    </p>
                    <div className="space-y-1">
                      {moreLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={closeMobile}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/80 hover:text-[#D4AF37] hover:bg-white/10 transition-colors"
                        >
                          <link.icon className={`h-5 w-5 ${link.iconColor}`} />
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <Button
                    asChild
                    className="w-full bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-cta"
                  >
                    <Link to="/anmal-dig2" onClick={closeMobile}>
                      Anmälan
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}