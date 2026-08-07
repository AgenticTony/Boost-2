import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export interface FieldControlProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

export interface FieldProps {
  id: string;
  label: string;
  error?: string;
  /** Extra guidance rendered under the control, e.g. a strength meter. */
  hint?: ReactNode;
  children: (props: FieldControlProps) => ReactNode;
}

/**
 * Label, control and validation message as one unit.
 *
 * Uses a render prop so the accessibility wiring cannot be forgotten: the
 * control always receives the id the label points at, `aria-invalid` when
 * there is an error, and `aria-describedby` pointing at the message. The
 * hand-written fields this replaces had labels and ids, but no error was ever
 * associated with its input - so a screen reader announced the field as valid
 * while a red message sat beneath it.
 */
export function Field({ id, label, error, hint, children }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      {hint}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}
