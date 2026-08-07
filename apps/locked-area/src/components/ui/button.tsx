import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Note on focus: no `focus-visible:outline-none` here.
 *
 * index.css defines a single app-wide focus ring (`*:focus-visible`, a navy
 * outline). Suppressing it per-component and substituting a ring - as
 * public-site's primitives do - leaves an app with two competing focus styles
 * depending on which element you happen to tab onto. One indicator, defined in
 * one place, is both more accessible and easier to keep consistent.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-brand-red text-white hover:bg-brand-red/90",
        success: "bg-success text-white hover:bg-success/90",
        outline:
          "border border-border bg-white text-text hover:bg-muted hover:text-text",
        danger: "border border-brand-red text-brand-red hover:bg-brand-red/5",
        /** For the navy header bar, where the surface is dark. */
        onDark:
          "border border-brand-red/30 text-brand-red-bright hover:bg-brand-red/10",
        ghost: "text-text-muted hover:bg-muted hover:text-text",
        link: "text-brand-red underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "h-10 w-10",
      },
      shape: {
        /** Pill CTA - the dominant call-to-action shape in this app. */
        pill: "rounded-cta",
        rounded: "rounded-input",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "pill",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, shape, block, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, shape, block, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
