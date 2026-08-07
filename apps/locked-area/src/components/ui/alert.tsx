import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "p-3 rounded-input border text-sm flex items-start gap-2",
  {
    variants: {
      variant: {
        error: "bg-error/10 border-error/20 text-error",
        success: "bg-success/10 border-success/20 text-success",
        info: "bg-surface-dark/5 border-border text-text",
      },
    },
    defaultVariants: { variant: "error" },
  },
);

const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
} as const;

export interface AlertProps extends VariantProps<typeof alertVariants> {
  children: ReactNode;
  className?: string;
}

/**
 * Inline status message for form and page feedback.
 *
 * Always carries `role="alert"`, so a message that appears after submit is
 * announced rather than silently painted - the hand-written versions this
 * replaces were inconsistent about that. The icon is decorative: it repeats
 * information the text and role already convey.
 */
export function Alert({ variant = "error", children, className }: AlertProps) {
  const Icon = ICONS[variant ?? "error"];

  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
