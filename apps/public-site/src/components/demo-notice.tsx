import { Info } from "lucide-react";

/**
 * Honest fallback shown when a form "submitted" but no backend is wired yet
 * (submit result `delivered === false`). Keeps the success state from
 * misleading the user: they're told their data was NOT actually sent, and
 * given a direct contact path. Disappears automatically once a real backend
 * returns delivered=true.
 */
export function DemoNotice({
  fallbackEmail = "info@boostbyfcr.se",
}: {
  fallbackEmail?: string;
}) {
  return (
    <div
      role="status"
      className="mt-6 flex items-start gap-3 rounded-xl border border-border/60 bg-muted/40 p-4 text-left"
    >
      <Info
        className="mt-0.5 h-5 w-5 shrink-0 text-brand-red"
        aria-hidden="true"
      />
      <p className="text-sm leading-relaxed text-text-muted">
        Det här formuläret är ännu inte kopplat till ett system, så din anmälan
        har inte skickats. Mejla oss direkt på{" "}
        <a
          className="font-semibold text-text underline"
          href={`mailto:${fallbackEmail}`}
        >
          {fallbackEmail}
        </a>{" "}
        så hjälper vi dig direkt.
      </p>
    </div>
  );
}
