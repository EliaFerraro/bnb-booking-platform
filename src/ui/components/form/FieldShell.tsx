import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

/**
 * Shared chrome for every form control: label, optional hint, error message and
 * the id wiring that connects them. Field components own their control styling
 * so inputs look identical wherever they appear; `className` targets the
 * wrapper, which is what callers need for grid spans.
 */

export const FIELD_LABEL_CLASS =
  "block text-[11px] tracking-[0.2em] uppercase text-neutral-600 font-semibold mb-2";

export const FIELD_CONTROL_CLASS =
  "w-full rounded-[8px] border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-950 transition-colors placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25 aria-[invalid=true]:border-red-600";

export function fieldDescribedBy(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(
    Boolean
  );
  return ids.length ? ids.join(" ") : undefined;
}

export interface FieldShellProps {
  id: string;
  label: string;
  /** Already translated. Presence alone marks the control invalid. */
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FieldShell({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={FIELD_LABEL_CLASS}>
        {label}
        {/* The requirement itself is conveyed by the control's required
            attribute, so the asterisk is decorative. */}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {children}

      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-neutral-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-start gap-1.5 text-xs text-red-700"
        >
          {/* Paired with an icon so the error is never signalled by colour alone. */}
          <HugeiconsIcon
            icon={Alert02Icon}
            className="w-3.5 h-3.5 mt-px shrink-0"
            strokeWidth={2}
          />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/** Wraps a control so a leading icon can sit inside it. */
export function FieldControlWithIcon({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
      >
        {icon}
      </span>
      {children}
    </div>
  );
}

export const FIELD_CONTROL_WITH_ICON_CLASS = cn(FIELD_CONTROL_CLASS, "pl-11");
