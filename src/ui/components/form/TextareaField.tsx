import type { Ref, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  FIELD_CONTROL_CLASS,
  FieldShell,
  fieldDescribedBy,
} from "./FieldShell";

type NativeTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "id" | "className" | "aria-invalid" | "aria-describedby"
>;

export interface TextareaFieldProps extends NativeTextareaProps {
  label: string;
  /** Already translated; its presence is what marks the field invalid. */
  error?: string;
  hint?: string;
  /** Applied to the wrapper — use it for grid spans, not for restyling the control. */
  className?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

export function TextareaField({
  label,
  error,
  hint,
  className,
  required,
  ref,
  ...textareaProps
}: TextareaFieldProps) {
  const id = useId();

  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <textarea
        {...textareaProps}
        id={id}
        ref={ref}
        required={required}
        className={cn(FIELD_CONTROL_CLASS, "resize-y")}
        aria-invalid={Boolean(error)}
        aria-describedby={fieldDescribedBy(id, hint, error)}
      />
    </FieldShell>
  );
}
