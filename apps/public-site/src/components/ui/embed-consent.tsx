import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Holds a third-party embed back until the visitor asks for it.
 *
 * Loading the Google Forms embed on sight contacts seven Google hosts before
 * anyone has agreed to anything. Even where the browser partitions the
 * cookies, the request still hands Google the visitor's IP and user agent -
 * which is the part EU regulators have actually ruled on, and it is what the
 * cookie policy promises we do not do without consent.
 *
 * `children` is a function, not an element, so the embed is not merely hidden
 * before consent - it is never constructed, and therefore never requested.
 *
 * The remembered choice lives in localStorage. Storing a consent decision is
 * itself "strictly necessary" under ePrivacy, so it needs no prior consent.
 */
export function EmbedConsent({
  provider,
  description,
  buttonLabel = "Öppna formuläret",
  storageKey,
  fallback,
  children,
}: {
  /** Named in the heading, so the visitor knows who they are about to contact. */
  provider: string;
  description: string;
  buttonLabel?: string;
  /** localStorage key, so the choice survives a reload. */
  storageKey: string;
  /** Offered to anyone who would rather not use the third party at all. */
  fallback?: ReactNode;
  children: () => ReactNode;
}) {
  // Read the stored choice during the first render rather than in an effect,
  // so someone who already accepted never sees the gate flash past. Safe here
  // because this is a client-rendered SPA with no hydration to mismatch.
  const [granted, setGranted] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === "granted";
    } catch {
      // Private mode or storage disabled - ask again rather than assume.
      return false;
    }
  });
  const wrapRef = useRef<HTMLDivElement>(null);
  const justAccepted = useRef(false);

  // Send keyboard focus into the embed once it replaces the button they used.
  useEffect(() => {
    if (!granted || !justAccepted.current) return;
    justAccepted.current = false;
    wrapRef.current?.querySelector("iframe")?.focus();
  }, [granted]);

  function accept() {
    justAccepted.current = true;
    try {
      localStorage.setItem(storageKey, "granted");
    } catch {
      // Not being able to remember it is not a reason to block the form.
    }
    setGranted(true);
  }

  if (granted) return <div ref={wrapRef}>{children()}</div>;

  return (
    <div className="px-6 py-10 md:px-10 md:py-12 text-center">
      <p className="text-xs font-body font-medium text-brand-red tracking-widest uppercase mb-3">
        Ett steg kvar
      </p>
      <h3 className="text-xl md:text-2xl font-display font-extrabold text-text mb-3">
        Formuläret laddas från {provider}
      </h3>
      <p className="text-text-muted leading-relaxed max-w-md mx-auto mb-6">
        {description}{" "}
        <Link
          to="/cookiepolicy"
          className="font-medium text-brand-navy underline underline-offset-2"
        >
          Läs mer i vår cookiepolicy
        </Link>
        .
      </p>
      <Button
        onClick={accept}
        className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-8 h-12 shadow-lg shadow-brand-red/25 transition-all duration-300"
      >
        {buttonLabel}
        <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
      </Button>
      {fallback && (
        <p className="mt-6 text-sm text-text-muted leading-relaxed max-w-md mx-auto">
          {fallback}
        </p>
      )}
    </div>
  );
}
