"use client";

import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { WhatsappIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/ui/components/shadcn/button";
import { whatsappHref } from "@/configuration/contact";
import { STRUCTURE_NAME } from "@/configuration/site";
import { RESPONSE_HOURS } from "@/configuration/stay";

/**
 * The confirmation panel, staged so it arrives rather than appears: the ring
 * and the tick are stroked on as if drawn by hand, then each line rises into
 * place behind them. Every duration below is a CSS animation, so
 * `prefers-reduced-motion` collapses the whole sequence to a plain cross-fade.
 */

/** Read by the form to know how long its own exit should last. */
export const EXIT_MS = 380;

export function EnquirySuccess({ email }: { email: string }) {
  const t = useTranslations("pages.contact.form");
  const tc = useTranslations("contactChannels");

  return (
    <div
      role="status"
      className="max-w-2xl mx-auto text-center flex flex-col items-center"
    >
      <DrawnTick />

      <h3
        className="font-serif text-2xl md:text-3xl tracking-wider uppercase text-neutral-950 mb-4 animate-rise-in"
        style={{ animationDelay: "900ms" }}
      >
        {t("success.title")}
      </h3>
      <p
        className="text-base text-neutral-700 leading-relaxed font-light mb-2 animate-rise-in"
        style={{ animationDelay: "1000ms" }}
      >
        {t("success.body", { email, hours: RESPONSE_HOURS })}
      </p>
      <p
        className="text-sm text-neutral-600 leading-relaxed font-light mb-8 animate-rise-in"
        style={{ animationDelay: "1080ms" }}
      >
        {t("success.spamHint")}
      </p>

      <div className="animate-rise-in" style={{ animationDelay: "1180ms" }}>
        <Button
          asChild
          className="bg-primary-500 text-neutral-50 px-8 py-5 rounded-full text-xs font-semibold tracking-widest uppercase h-auto hover:bg-primary-600"
        >
          <a
            href={whatsappHref(
              tc("whatsappPrefill", { brand: STRUCTURE_NAME }),
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HugeiconsIcon icon={WhatsappIcon} className="w-4 h-4" strokeWidth={1.5} />
            {t("success.faster")}
          </a>
        </Button>
      </div>
    </div>
  );
}

/**
 * The ring and the tick are one continuous gesture: both are drawn with
 * `stroke-dasharray` equal to their own length, so animating the offset to zero
 * uncovers the stroke end to end. The lengths are the geometric ones — a
 * circle of r=31 is 2πr ≈ 195, and the tick's two segments measure ≈ 40.
 */
function DrawnTick() {
  return (
    <svg
      viewBox="0 0 68 68"
      className="w-[68px] h-[68px] mb-7"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="34"
        cy="34"
        r="31"
        stroke="var(--color-primary-500)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="195"
        className="animate-draw-ring origin-center -rotate-90"
      />
      <path
        d="M21 35.5 L30.5 45 L47.5 25"
        stroke="var(--color-primary-500)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="40"
        className="animate-draw-tick"
      />
    </svg>
  );
}
