import { z } from "zod";

/**
 * The single definition of what makes an acceptable password.
 *
 * Previously this lived twice - once in login.tsx and once in
 * reset-password.tsx - as identical literal arrays, regexes and score
 * lookups. Two copies of a security rule is one copy too many: they drift,
 * and the weaker one wins wherever it happens to be used.
 *
 * Note the client cannot *enforce* anything; Supabase's own password policy is
 * the real gate. What this provides is a consistent contract and honest
 * feedback before a request is ever made.
 */

export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

export const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_REQUIREMENTS: readonly PasswordRequirement[] = [
  {
    label: `Minst ${MIN_PASSWORD_LENGTH} tecken`,
    test: (p) => p.length >= MIN_PASSWORD_LENGTH,
  },
  { label: "En stor bokstav", test: (p) => /[A-Z]/.test(p) },
  { label: "En siffra", test: (p) => /[0-9]/.test(p) },
  {
    label: "Ett specialtecken (!@#$%^&*)",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

/** Labels indexed by how many requirements are met (0 through 4). */
const STRENGTH_LABELS = [
  "Svag",
  "Svag",
  "Medel",
  "Stark",
  "Mycket stark",
] as const;

const STRENGTH_COLORS = [
  "bg-error",
  "bg-error",
  "bg-brand-gold",
  "bg-brand-navy",
  "bg-success",
] as const;

export interface PasswordStrength {
  /** How many requirements are met, 0..PASSWORD_REQUIREMENTS.length. */
  score: number;
  label: string;
  /** Tailwind class for the strength meter fill. */
  colorClass: string;
  /** Percentage width for the meter. */
  percent: number;
  requirements: Array<{ label: string; met: boolean }>;
  satisfied: boolean;
}

export function evaluatePassword(password: string): PasswordStrength {
  const requirements = PASSWORD_REQUIREMENTS.map((r) => ({
    label: r.label,
    met: r.test(password),
  }));
  const score = requirements.filter((r) => r.met).length;

  return {
    score,
    label: STRENGTH_LABELS[score],
    colorClass: STRENGTH_COLORS[score],
    percent: (score / PASSWORD_REQUIREMENTS.length) * 100,
    requirements,
    satisfied: score === PASSWORD_REQUIREMENTS.length,
  };
}

/**
 * Zod schema enforcing every requirement, reporting each unmet rule.
 *
 * `superRefine` rather than a chain of `.refine()` calls: refine short-circuits
 * the reported issue to the first failure, and it also erases the string input
 * type when applied programmatically, which breaks react-hook-form's resolver
 * typing.
 */
export const passwordSchema = z
  .string()
  .min(1, "Lösenord är obligatoriskt")
  .superRefine((value, ctx) => {
    for (const requirement of PASSWORD_REQUIREMENTS) {
      if (!requirement.test(value)) {
        ctx.addIssue({ code: "custom", message: requirement.label });
      }
    }
  });

export const emailSchema = z
  .string()
  .min(1, "E-post är obligatoriskt")
  .email("Ange en giltig e-postadress");
