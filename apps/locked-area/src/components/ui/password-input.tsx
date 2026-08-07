import * as React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/input";

/**
 * Password field with its own show/hide toggle.
 *
 * The toggle was previously copy-pasted into four fields across three pages,
 * each managing its own `showPassword` state. Owning that state here means a
 * page cannot accidentally wire one toggle to two inputs - which login.tsx
 * did: a single `showPassword` flag drove both the password and the
 * confirm-password field, so revealing one revealed the other.
 */
const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type" | "adornment" | "icon">
>((props, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      icon={Lock}
      adornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Dölj lösenord" : "Visa lösenord"}
          aria-pressed={visible}
          className="text-text-muted hover:text-text"
        >
          {visible ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      }
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
