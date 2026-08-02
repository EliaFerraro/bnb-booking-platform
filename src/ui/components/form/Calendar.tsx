"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

/**
 * A month grid built on `Intl` alone — no date library.
 *
 * Everything is computed in UTC because the value it produces is a calendar day
 * (`YYYY-MM-DD`), not an instant: a local-time `Date` would land on the previous
 * day for guests east of Greenwich.
 */

/**
 * Monday-first for all five locales. `Intl.Locale.weekInfo` would answer this
 * properly but is still missing in Firefox, and every market this property
 * sells to starts the week on Monday anyway.
 */
const WEEK_STARTS_ON = 1;

const pad = (value: number) => String(value).padStart(2, "0");

const toIso = (date: Date) =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

const fromIso = (iso: string) => new Date(`${iso}T00:00:00Z`);

const addDays = (date: Date, days: number) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));

const addMonths = (date: Date, months: number) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));

const startOfMonth = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const daysInMonth = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();

/** Today as a calendar day in the guest's own zone, which is the one they mean. */
export const todayIso = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** The earliest departure that can follow a given arrival. */
export const nextDayIso = (iso: string) => toIso(addDays(fromIso(iso), 1));

export interface CalendarProps {
  /** Selected day, `YYYY-MM-DD`. */
  value?: string;
  onSelect: (value: string) => void;
  /** Earliest selectable day, inclusive. */
  min?: string;
  locale: string;
  labels: { previousMonth: string; nextMonth: string };
}

export function Calendar({ value, onSelect, min, locale, labels }: CalendarProps) {
  const today = todayIso();
  const selected = value || undefined;

  // Open on the selected month, or on the first month that has selectable days.
  const [view, setView] = useState(() =>
    startOfMonth(fromIso(selected ?? (min && min > today ? min : today)))
  );

  // The day that owns the grid's single tab stop; arrow keys move it.
  const [focused, setFocused] = useState<string>(
    () => selected ?? (min && min > today ? min : today)
  );
  const focusRef = useRef<HTMLButtonElement>(null);
  const shouldFocusRef = useRef(false);

  useEffect(() => {
    if (shouldFocusRef.current) {
      focusRef.current?.focus();
      shouldFocusRef.current = false;
    }
  });

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(view),
    [locale, view]
  );

  const weekdays = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      timeZone: "UTC",
    });
    // 4 August 2024 was a Sunday, so offsetting from it yields any week start.
    return Array.from({ length: 7 }, (_, index) =>
      format.format(new Date(Date.UTC(2024, 7, 4 + WEEK_STARTS_ON + index)))
    );
  }, [locale]);

  const dayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    [locale]
  );

  const leadingBlanks = (view.getUTCDay() - WEEK_STARTS_ON + 7) % 7;
  const total = daysInMonth(view);

  const isDisabled = (iso: string) => Boolean(min && iso < min);

  const moveFocus = (days: number) => {
    const next = toIso(addDays(fromIso(focused), days));
    setFocused(next);
    shouldFocusRef.current = true;

    const nextMonth = startOfMonth(fromIso(next));
    if (nextMonth.getTime() !== view.getTime()) setView(nextMonth);
  };

  const goToMonth = (offset: number) => {
    const next = addMonths(view, offset);
    setView(next);
    // Keep the tab stop inside the month on screen.
    setFocused(toIso(next));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };

    if (event.key in steps) {
      event.preventDefault();
      moveFocus(steps[event.key]);
      return;
    }

    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const current = fromIso(focused);
      const next = new Date(
        Date.UTC(
          current.getUTCFullYear(),
          current.getUTCMonth() + (event.key === "PageUp" ? -1 : 1),
          current.getUTCDate()
        )
      );
      setFocused(toIso(next));
      setView(startOfMonth(next));
      shouldFocusRef.current = true;
    }
  };

  return (
    <div className="w-[19.5rem] p-4">
      <div className="flex items-center justify-between mb-4">
        <NavButton label={labels.previousMonth} onClick={() => goToMonth(-1)}>
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" strokeWidth={2} />
        </NavButton>

        <p
          aria-live="polite"
          className="font-serif text-base tracking-[0.12em] uppercase text-neutral-950"
        >
          {monthLabel}
        </p>

        <NavButton label={labels.nextMonth} onClick={() => goToMonth(1)}>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" strokeWidth={2} />
        </NavButton>
      </div>

      {/* A plain group of buttons rather than an ARIA grid: each day already
          carries its full date as a label, and a grid would have to be spelled
          out row by row to be valid. Arrow-key navigation is kept regardless. */}
      <div
        role="group"
        onKeyDown={handleKeyDown}
        className="grid grid-cols-7 gap-y-1 justify-items-center"
      >
        {weekdays.map((weekday) => (
          <span
            key={weekday}
            aria-hidden="true"
            className="pb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-500"
          >
            {weekday.slice(0, 2)}
          </span>
        ))}

        {Array.from({ length: leadingBlanks }, (_, index) => (
          <span key={`blank-${index}`} aria-hidden="true" />
        ))}

        {Array.from({ length: total }, (_, index) => {
          const date = addDays(view, index);
          const iso = toIso(date);
          const disabled = isDisabled(iso);
          const isSelected = iso === selected;
          const isToday = iso === today;

          return (
            <button
              key={iso}
              type="button"
              ref={iso === focused ? focusRef : undefined}
              tabIndex={iso === focused ? 0 : -1}
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={dayLabel.format(date)}
              onClick={() => onSelect(iso)}
              onFocus={() => setFocused(iso)}
              className={cn(
                "size-9 rounded-full text-sm transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
                disabled && "text-neutral-300 cursor-not-allowed",
                !disabled && !isSelected && "text-neutral-800 hover:bg-secondary-100",
                isSelected && "bg-primary-500 text-neutral-50 font-semibold",
                // Today is marked by weight rather than by a second colour, so
                // it never competes with the selected day.
                isToday && !isSelected && "font-semibold text-primary-700"
              )}
            >
              {date.getUTCDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="size-8 rounded-full flex items-center justify-center text-neutral-600 transition-colors hover:bg-secondary-100 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
    >
      {children}
    </button>
  );
}
