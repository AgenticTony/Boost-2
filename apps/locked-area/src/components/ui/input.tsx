import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Leading icon. Every text field in this app has one. */
  icon?: LucideIcon;
  /** Trailing control, e.g. a show/hide password toggle. */
  adornment?: React.ReactNode;
}

/**
 * Text input with the app's leading-icon treatment built in.
 *
 * The wrapper is part of the component because the icon has to be positioned
 * against it; every form previously repeated the same relative/absolute pair
 * plus an identical 12-class string, seven times over.
 *
 * No `focus-visible:outline-none` - see the note in button.tsx.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, adornment, ...props }, ref) => {
    const field = (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full py-2.5 bg-white border border-border rounded-input text-text",
          "placeholder:text-text-muted/60 disabled:opacity-50 disabled:cursor-not-allowed",
          Icon ? "pl-10" : "pl-4",
          adornment ? "pr-10" : "pr-4",
          className,
        )}
        {...props}
      />
    );

    if (!Icon && !adornment) return field;

    return (
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
        )}
        {field}
        {adornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {adornment}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
