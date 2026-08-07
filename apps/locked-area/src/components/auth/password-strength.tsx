import { Check, X } from "lucide-react";
import { evaluatePassword } from "@/lib/password-policy";
import { cn } from "@/lib/utils";

/**
 * Strength meter and requirement checklist for a password field.
 *
 * Renders nothing for an empty value - there is no useful feedback to give
 * before the member has typed anything, and an all-red checklist on an
 * untouched field reads as failure rather than guidance.
 */
export function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;

  const { label, colorClass, percent, requirements } = evaluatePassword(value);

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <div
          className="flex-1 h-1.5 bg-border rounded-full overflow-hidden"
          role="progressbar"
          aria-label="Lösenordsstyrka"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={label}
        >
          <div
            className={cn("h-full transition-all duration-300", colorClass)}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-text-muted w-20 text-right">{label}</span>
      </div>

      <ul className="space-y-1">
        {requirements.map((requirement) => (
          <li
            key={requirement.label}
            className="flex items-center gap-1.5 text-xs"
          >
            {requirement.met ? (
              <Check className="w-3 h-3 text-success" aria-hidden="true" />
            ) : (
              <X className="w-3 h-3 text-text-muted" aria-hidden="true" />
            )}
            <span
              className={requirement.met ? "text-success" : "text-text-muted"}
            >
              {requirement.label}
            </span>
            <span className="sr-only">
              {requirement.met ? "uppfyllt" : "ej uppfyllt"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
