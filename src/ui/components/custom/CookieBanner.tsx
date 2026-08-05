"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/ui/components/shadcn/button";
import { CookiePreferencesDialog } from "./CookiePreferencesDialog";
import { useConsent } from "./ConsentProvider";

/**
 * Shown until a decision has been made against the current policy version.
 *
 * "Reject" is a button of equal weight to "Accept", not a link buried in the
 * small print: a banner where refusing is harder than accepting does not
 * collect valid consent, whatever it says. Nothing is loaded from Google before
 * a choice is made, so there is no dark pattern to compensate for either.
 */
export function CookieBanner() {
  const t = useTranslations("consent.banner");
  const locale = useLocale();
  const { consent, acceptAll, rejectAll } = useConsent();
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Rendered server-side as null and on the client only once the store reports
  // no decision, so a returning visitor never sees it flash.
  if (consent) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="false"
        aria-label={t("title")}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-neutral-50/97 backdrop-blur-sm shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
      >
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="font-serif text-sm tracking-[0.15em] uppercase text-primary-500">
              {t("title")}
            </span>
            <p className="text-xs md:text-sm leading-relaxed text-neutral-700 font-light">
              {t("body")}{" "}
              <Link
                href={`/${locale}/cookie-policy`}
                className="underline underline-offset-4 hover:text-primary-500 transition-colors"
              >
                {t("policyLink")}
              </Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Button
              variant="ghost"
              onClick={() => setPreferencesOpen(true)}
              className="cursor-pointer text-[11px] uppercase tracking-[0.15em] text-neutral-600 hover:text-neutral-900"
            >
              {t("customise")}
            </Button>
            <Button
              variant="outline"
              onClick={rejectAll}
              className="cursor-pointer text-[11px] uppercase tracking-[0.15em] border-primary-500 text-primary-500 hover:bg-primary-500/5"
            >
              {t("reject")}
            </Button>
            <Button
              onClick={acceptAll}
              className="cursor-pointer text-[11px] uppercase tracking-[0.15em] bg-primary-500 text-neutral-50 hover:bg-primary-400"
            >
              {t("accept")}
            </Button>
          </div>
        </div>
      </div>

      <CookiePreferencesDialog
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
      />
    </>
  );
}
