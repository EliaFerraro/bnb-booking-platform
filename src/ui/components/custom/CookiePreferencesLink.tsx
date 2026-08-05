"use client";

import { useState, type ReactNode } from "react";
import { CookiePreferencesDialog } from "./CookiePreferencesDialog";

/**
 * A button that opens the cookie preferences, styled by whoever uses it. Exists
 * so the footer and the cookie policy page can both offer the same affordance
 * without either of them having to hold dialog state.
 */
export function CookiePreferencesLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <CookiePreferencesDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
