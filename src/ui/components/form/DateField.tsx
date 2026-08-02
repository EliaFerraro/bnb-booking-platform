"use client";

import { useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Popover } from "radix-ui";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Calendar, todayIso } from "./Calendar";
import { FIELD_CONTROL_CLASS, FieldShell, fieldDescribedBy } from "./FieldShell";

/**
 * Replaces `<input type="date">`, whose dropdown is browser chrome and cannot
 * be styled or translated to match the rest of the site. The trigger is a
 * button the width of the field — the whole control opens the calendar, not
 * just an icon — and the value reaches the server through a hidden input, so
 * the form still posts a plain `YYYY-MM-DD`.
 *
 * The trade-off is that dates now require JavaScript. Both date fields are
 * optional, and the rest of the form still submits and validates without it.
 */

export interface DateFieldProps {
  name: string;
  label: string;
  /** `YYYY-MM-DD`, or empty when unset. */
  value: string;
  onValueChange: (value: string) => void;
  /** Already translated; its presence is what marks the field invalid. */
  error?: string;
  hint?: string;
  /** Earliest selectable day. Never earlier than today. */
  min?: string;
  required?: boolean;
  /** Applied to the wrapper — use it for grid spans. */
  className?: string;
}

export function DateField({
  name,
  label,
  value,
  onValueChange,
  error,
  hint,
  min,
  required,
  className,
}: DateFieldProps) {
  const t = useTranslations("datePicker");
  const locale = useLocale();
  const id = useId();
  const [open, setOpen] = useState(false);

  const display = useMemo(() => {
    if (!value) return null;
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${value}T00:00:00Z`));
  }, [locale, value]);

  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <input type="hidden" name={name} value={value} />

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            id={id}
            type="button"
            // `aria-invalid` is not valid on a button role, so the invalid
            // state travels as data — the error text itself is announced
            // through `aria-describedby`.
            data-invalid={error ? "true" : undefined}
            aria-describedby={fieldDescribedBy(id, hint, error)}
            className={cn(
              FIELD_CONTROL_CLASS,
              "flex items-center justify-between gap-3 text-left",
              "data-[invalid=true]:border-red-600",
              "data-[state=open]:border-primary-500 data-[state=open]:ring-2 data-[state=open]:ring-primary-500/25",
              !display && "text-neutral-400"
            )}
          >
            <span className="truncate">{display ?? t("placeholder")}</span>
            <HugeiconsIcon
              icon={Calendar03Icon}
              className="w-4 h-4 shrink-0 text-neutral-500"
              strokeWidth={1.5}
            />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            className="z-50 origin-(--radix-popover-content-transform-origin) rounded-2xl bg-neutral-50 shadow-2xl ring-1 ring-neutral-950/5 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            <Calendar
              locale={locale}
              value={value}
              // Yesterday is never a valid arrival, whatever the caller asks for.
              min={min && min > todayIso() ? min : todayIso()}
              onSelect={(next) => {
                onValueChange(next);
                setOpen(false);
              }}
              labels={{
                previousMonth: t("previousMonth"),
                nextMonth: t("nextMonth"),
              }}
            />

            {value && (
              <div className="border-t border-neutral-200 px-4 py-2.5 text-right">
                <button
                  type="button"
                  onClick={() => {
                    onValueChange("");
                    setOpen(false);
                  }}
                  className="text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  {t("clear")}
                </button>
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </FieldShell>
  );
}
