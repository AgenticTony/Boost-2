import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The app's single loading indicator.
 *
 * Replaces five separate hand-rolled spinners that had drifted apart in size,
 * border weight and colour - two used a bare `border-b-2` arc, three used a
 * full track with a coloured head, and none of them carried a status role, so
 * screen readers announced nothing at all while the app was busy.
 */
const spinnerVariants = cva("animate-spin rounded-full", {
  variants: {
    size: {
      sm: "h-5 w-5 border-2",
      md: "h-8 w-8 border-4",
      lg: "h-12 w-12 border-4",
    },
    tone: {
      brand: "border-brand-navy/20 border-t-brand-navy",
      accent: "border-brand-red/20 border-t-brand-red",
      /** For placement on a dark or coloured fill, e.g. inside a button. */
      onDark: "border-white/40 border-t-white",
    },
  },
  defaultVariants: { size: "md", tone: "brand" },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  /** Announced to assistive tech. Set to null for a purely decorative spinner. */
  label?: string | null;
}

export function Spinner({
  size,
  tone,
  className,
  label = "Laddar",
}: SpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size, tone }), className)}
      {...(label === null
        ? { "aria-hidden": true }
        : { role: "status", "aria-label": label })}
    />
  );
}

/** Spinner centred in a block of vertical space, for page and section loads. */
export function LoadingState({
  label = "Laddar",
  className,
  size = "md",
  tone = "brand",
}: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <Spinner size={size} tone={tone} label={label} />
    </div>
  );
}
