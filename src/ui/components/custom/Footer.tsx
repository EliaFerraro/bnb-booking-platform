import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MapsLocation01Icon,
  CallIcon,
  Mail01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { CookiePreferencesLink } from "@/ui/components/custom/CookiePreferencesLink";
import {
  EMAIL,
  PHONE_DISPLAY,
  PHONE_HREF,
  mailtoHref,
  whatsappHref,
} from "@/configuration/contact";

/** Shared by the three legal links and the preferences button, so they read as one row. */
const LEGAL_LINK_CLASS =
  "hover:text-neutral-50 transition-colors focus-visible:outline-none focus-visible:text-neutral-50 focus-visible:underline underline-offset-4 uppercase";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("contactChannels");
  const locale = useLocale();
  return (
    <footer className="w-full bg-primary-500 text-neutral-50 py-16 px-6 md:px-12 lg:px-24 font-light text-xs tracking-wider">
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pb-12 border-b border-neutral-50/10 text-center">
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-3">
            <h4 className="font-serif text-[10px] tracking-[0.25em] uppercase text-secondary-200/80 font-semibold">
              {t("location.title")}
            </h4>
            <div className="flex flex-col items-center lg:items-start space-y-1 text-[13px] text-secondary-50 tracking-wide">
              <div className="flex items-center space-x-2.5">
                <HugeiconsIcon
                  icon={MapsLocation01Icon}
                  className="w-4 h-4 text-secondary-200/80"
                  strokeWidth={1.5}
                />
                <span>{t("location.address")}</span>
              </div>
              <p className="pl-0 lg:pl-6 text-secondary-200 font-medium uppercase text-xs tracking-widest">
                {t("location.city")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center px-4 border-y lg:border-y-0 lg:border-x border-neutral-50/10 py-6 lg:py-2">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-secondary-200 font-medium mb-3 block">
              {t("brand.name")}
            </span>
            <blockquote className="text-secondary-50/70 leading-relaxed font-serif italic text-[13px] tracking-wide max-w-xs">
              &ldquo;{t("brand.tagline")}&rdquo;
            </blockquote>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end space-y-3">
            <h4 className="font-serif text-[10px] tracking-[0.25em] uppercase text-secondary-200/80 font-semibold">
              {t("contact.title")}
            </h4>
            <div className="flex flex-col items-center lg:items-end space-y-2 text-[13px] text-secondary-50 tracking-wide">
              <a
                href={whatsappHref(tc("whatsappPrefill"))}
                data-track="contact_whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 hover:text-secondary-200 transition-colors group"
              >
                <HugeiconsIcon
                  icon={WhatsappIcon}
                  className="w-4 h-4 text-secondary-200/80 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
                <span>WhatsApp</span>
              </a>
              <a
                href={PHONE_HREF}
                data-track="contact_phone"
                className="flex items-center space-x-2.5 hover:text-secondary-200 transition-colors group"
              >
                <HugeiconsIcon
                  icon={CallIcon}
                  className="w-4 h-4 text-secondary-200/80 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
                <span>{PHONE_DISPLAY}</span>
              </a>
              <a
                href={mailtoHref(tc("mailSubject"), tc("mailBody"))}
                data-track="contact_email"
                className="flex items-center space-x-2.5 hover:text-secondary-200 transition-colors group"
              >
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="w-4 h-4 text-secondary-200/80 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
                <span>{EMAIL}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="w-full pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-[10px] text-secondary-200/60 uppercase tracking-[0.15em]">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <span className="text-neutral-200">
              {t("legal.classification")}
            </span>
            <span className="hidden sm:inline text-neutral-50/20">|</span>
            <span>{t("legal.cin")}</span>
          </div>

          {/* Reachable from every page, which is what makes withdrawing consent
              as easy as giving it — GDPR art. 7(3) asks for exactly that. */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href={`/${locale}/privacy`} className={LEGAL_LINK_CLASS}>
              {t("legal.privacy")}
            </Link>
            <Link href={`/${locale}/cookie-policy`} className={LEGAL_LINK_CLASS}>
              {t("legal.cookies")}
            </Link>
            <Link href={`/${locale}/terms`} className={LEGAL_LINK_CLASS}>
              {t("legal.terms")}
            </Link>
            <CookiePreferencesLink
              className={`${LEGAL_LINK_CLASS} cursor-pointer`}
            >
              {t("legal.manageCookies")}
            </CookiePreferencesLink>
          </nav>
        </div>

        <div className="mt-12 text-[9px] text-neutral-400/50 tracking-[0.25em] text-center uppercase">
          {t("legal.copyright")}
        </div>
      </div>
    </footer>
  );
}
