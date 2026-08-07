import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: string;
  icon?: LucideIcon;
  /** Accent for the eyebrow, icon tile and background wash. */
  accent?: "navy" | "red";
  /** Extra content under the subtitle, e.g. a row of stat chips. */
  children?: ReactNode;
}

const ACCENTS = {
  navy: {
    eyebrow: "text-brand-navy",
    tile: "bg-brand-navy/10 text-brand-navy",
    wash: "bg-brand-gold/5",
  },
  red: {
    eyebrow: "text-brand-red",
    tile: "bg-brand-red/10 text-brand-red",
    wash: "bg-brand-red/5",
  },
} as const;

/**
 * The standard page hero.
 *
 * Replaces PageLayout, which bundled three unrelated jobs behind eight
 * optional props: a sticky back-bar, this hero, and a page wrapper. The
 * back-bar had no consumers at all, and the wrapper rendered a second `<main>`
 * inside the one App.tsx already provides - two main landmarks on every page
 * using it, which is invalid HTML and leaves the skip link pointing at the
 * wrong one.
 *
 * library.tsx had opted out of PageLayout entirely and hand-rolled its own
 * hero; the `accent` and `children` props are what it needed to come back in.
 */
export function PageHero({
  title,
  subtitle,
  badge,
  icon: Icon,
  accent = "navy",
  children,
}: PageHeroProps) {
  const tone = ACCENTS[accent];

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-surface-dark opacity-50 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none",
          tone.wash,
        )}
        aria-hidden="true"
      />

      <div className="container-page relative py-16 md:py-20">
        <div className="max-w-3xl">
          {(badge || Icon) && (
            <div className="flex items-center gap-2 mb-4">
              {Icon && (
                <div
                  className={cn(
                    "w-10 h-10 rounded-input flex items-center justify-center",
                    tone.tile,
                  )}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
              )}
              {badge && (
                <span
                  className={cn(
                    "text-sm font-semibold uppercase tracking-wider",
                    tone.eyebrow,
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
          )}

          <h1 className="text-text text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-text-muted text-lg leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
