import type { InputHTMLAttributes, Ref } from "react";
import { useId } from "react";
import { HugeiconsIcon, type HugeiconsProps } from "@hugeicons/react";
import {
  FIELD_CONTROL_CLASS,
  FIELD_CONTROL_WITH_ICON_CLASS,
  FieldControlWithIcon,
  FieldShell,
  fieldDescribedBy,
} from "./FieldShell";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "className" | "aria-invalid" | "aria-describedby"
>;

export interface TextFieldProps extends NativeInputProps {
  label: string;
  /** Already translated; its presence is what marks the field invalid. */
  error?: string;
  hint?: string;
  /** Icon shown inside the control, e.g. a people icon for a guest count. */
  icon?: HugeiconsProps["icon"];
  /** Applied to the wrapper — use it for grid spans, not for restyling the input. */
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  label,
  error,
  hint,
  icon,
  className,
  required,
  ref,
  ...inputProps
}: TextFieldProps) {
  const id = useId();

  const control = (
    <input
      {...inputProps}
      id={id}
      ref={ref}
      required={required}
      className={icon ? FIELD_CONTROL_WITH_ICON_CLASS : FIELD_CONTROL_CLASS}
      aria-invalid={Boolean(error)}
      aria-describedby={fieldDescribedBy(id, hint, error)}
    />
  );

  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      {icon ? (
        <FieldControlWithIcon
          icon={
            <HugeiconsIcon icon={icon} className="w-4 h-4" strokeWidth={1.5} />
          }
        >
          {control}
        </FieldControlWithIcon>
      ) : (
        control
      )}
    </FieldShell>
  );
}
