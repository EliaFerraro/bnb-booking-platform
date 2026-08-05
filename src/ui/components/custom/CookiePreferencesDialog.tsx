"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/shadcn/dialog";
import {
  CONSENT_CATEGORIES,
  OPTIONAL_CONSENT_CATEGORIES,
  type ConsentCategory,
} from "@/configuration/privacy";
import { NECESSARY_ONLY } from "@/lib/consent/cookie";
import type { ConsentChoices } from "@/lib/consent/schema";
import { useConsent } from "./ConsentProvider";

/**
 * The one preferences surface, shared by the banner's "Preferences" button and
 * the "Manage cookies" link in the footer. Withdrawing has to be as easy as
 * consenting (GDPR art. 7(3)), which is why this is reachable from every page
 * and takes effect the moment it is saved — the map unmounts on the spot, with
 * no reload.
 */
export function CookiePreferencesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("consent");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* overflow-x-hidden because DialogContent is a grid, and grid items
          default to min-width:auto — one over-wide child would otherwise give
          the whole dialog a horizontal scrollbar. */}
      <DialogContent
        closeLabel={t("dialog.close")}
        className="overflow-x-hidden *:min-w-0"
      >
        {/* Mounted only while open, so the toggles seed themselves from the
            current choice on every open. Re-seeding an always-mounted form from
            an effect would be the obvious alternative and is the worse one: it
            costs a render pass whose only job is to correct the one before it. */}
        {open && <PreferencesForm onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function PreferencesForm({ onDone }: { onDone: () => void }) {
  const t = useTranslations("consent");
  const { consent, save, acceptAll, rejectAll } = useConsent();

  const [draft, setDraft] = useState<ConsentChoices>(
    consent?.c ?? NECESSARY_ONLY
  );

  const toggle = (category: ConsentCategory) =>
    setDraft((current) => ({ ...current, [category]: !current[category] }));

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-serif text-lg tracking-wide text-foreground normal-case">
          {t("dialog.title")}
        </DialogTitle>
        <DialogDescription className="text-sm leading-relaxed normal-case tracking-normal">
          {t("dialog.description")}
        </DialogDescription>
      </DialogHeader>

      <div className="flex min-w-0 flex-col gap-3">
        {CONSENT_CATEGORIES.map((category) => {
          const optional = (
            OPTIONAL_CONSENT_CATEGORIES as readonly ConsentCategory[]
          ).includes(category);

          return (
            <div
              key={category}
              className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-border p-4"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  {t(`categories.${category}.label`)}
                </span>
                <span className="text-xs leading-relaxed text-foreground/70">
                  {t(`categories.${category}.description`)}
                </span>
              </div>

              {optional ? (
                <button
                  type="button"
                  role="switch"
                  aria-checked={draft[category]}
                  aria-label={t(`categories.${category}.label`)}
                  onClick={() => toggle(category)}
                  className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${
                    draft[category]
                      ? "border-primary-500 bg-primary-500"
                      : "border-neutral-300 bg-neutral-200"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-0.5 size-4.5 rounded-full bg-white shadow-sm transition-transform ${
                      draft[category] ? "translate-x-5.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              ) : (
                <span className="mt-1 shrink-0 text-[10px] uppercase tracking-[0.15em] text-foreground/50">
                  {t("categories.necessary.always")}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Stacked rather than three across: the labels are long in every locale
          and uppercase tracking makes them longer still, which overflowed the
          dialog. Saving is the primary action and gets the full width; the two
          blanket choices sit below it, equally weighted — a "reject" that is
          harder to reach than "accept" does not collect valid consent. */}
      <div className="flex flex-col gap-2 pt-2">
        <Button
          onClick={() => {
            save(draft);
            onDone();
          }}
          className="w-full cursor-pointer bg-primary-500 text-neutral-50 hover:bg-primary-400 text-[11px] uppercase tracking-[0.12em]"
        >
          {t("dialog.save")}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => {
              rejectAll();
              onDone();
            }}
            className="w-full cursor-pointer text-[11px] uppercase tracking-[0.12em] px-2"
          >
            {t("dialog.rejectAll")}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              acceptAll();
              onDone();
            }}
            className="w-full cursor-pointer text-[11px] uppercase tracking-[0.12em] px-2"
          >
            {t("dialog.acceptAll")}
          </Button>
        </div>
      </div>
    </>
  );
}
