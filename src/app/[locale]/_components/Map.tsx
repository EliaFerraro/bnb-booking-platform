"use client";

import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { MapsLocation01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/ui/components/shadcn/button";
import { useConsent } from "@/ui/components/custom/ConsentProvider";
import { trackEvent } from "@/lib/analytics/track";
import {
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_PLACE_URL,
} from "@/configuration/contact";

/**
 * Rendered by the locale layout, so it appears above the footer on every page —
 * which is exactly why it has to be gated. An unconditional Google iframe on
 * every page would send every visitor's IP address to Google before they had
 * agreed to anything.
 *
 * A client component rather than a server one reading the cookie: calling
 * cookies() in the layout would opt the whole route subtree out of static
 * rendering permanently, on every page, to save one brief swap on a frame that
 * sits below the fold. The trade is not worth it — and it would rule out ever
 * pre-rendering the five locales.
 */
export function Map() {
  const t = useTranslations("map");
  const tc = useTranslations("consent.map");
  const { hasConsent, grant } = useConsent();

  return (
    // Nessun padding: la mappa è a tutta larghezza e attaccata alla sezione
    // precedente, altrimenti bg-secondary-50 lascia una banda chiara visibile
    // sopra l'iframe (evidente sotto la fascia primary della pagina contatti).
    <section id="mappa-section" className="w-full bg-secondary-50">
      <div className="w-full h-80 md:h-112.5 relative shadow-inner overflow-hidden">
        {hasConsent("maps") ? (
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            className="w-full h-full border-0 grayscale opacity-85 hover:grayscale-0 transition-all duration-700 ease-in-out"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t("title")}
          />
        ) : (
          <MapPlaceholder
            onLoad={() => {
              grant("maps");
              // How many people actually want the map, which is the only way to
              // know whether gating it costs anything.
              trackEvent("map_loaded");
            }}
            t={tc}
          />
        )}
      </div>
    </section>
  );
}

/**
 * Deliberately an early-return sibling of the iframe rather than a wrapper
 * around a hidden one: a rendered <iframe> fetches from Google no matter what
 * CSS says about it, so the element itself must not exist until consent.
 *
 * Occupies the same height as the frame it replaces, so granting consent swaps
 * one for the other without shifting the page.
 */
function MapPlaceholder({
  onLoad,
  t,
}: {
  onLoad: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-6 text-center bg-secondary-50 border-y border-secondary-200/40">
      <HugeiconsIcon
        icon={MapsLocation01Icon}
        className="w-8 h-8 text-primary-500/50"
        strokeWidth={1.2}
      />
      <div className="flex flex-col gap-2 max-w-md">
        <span className="font-serif text-sm tracking-[0.2em] uppercase text-primary-500">
          {t("title")}
        </span>
        <p className="text-xs md:text-sm leading-relaxed text-neutral-600 font-light">
          {t("body")}
        </p>
      </div>

      <Button
        onClick={onLoad}
        className="cursor-pointer bg-primary-500 text-neutral-50 hover:bg-primary-400 text-[11px] uppercase tracking-[0.15em]"
      >
        {t("load")}
      </Button>

      {/* For visitors who would rather never load it: the address is still
          reachable, just on Google's own site and on their own initiative. */}
      <a
        href={GOOGLE_MAPS_PLACE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 underline underline-offset-4 hover:text-primary-500 transition-colors"
      >
        {t("fallback")}
      </a>
    </div>
  );
}
