import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageHero } from "../_components/PageHero";
import { Button } from "@/ui/components/shadcn/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CallIcon,
  Mail01Icon,
  MapsLocation01Icon,
  Clock01Icon,
  CarIcon,
  TrainIcon,
  Airplane01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import {
  EMAIL,
  PHONE_DISPLAY,
  PHONE_HREF,
  mailtoHref,
  whatsappHref,
} from "@/configuration/contact";

const DIRECTIONS = [
  { key: "car", icon: CarIcon },
  { key: "train", icon: TrainIcon },
  { key: "plane", icon: Airplane01Icon },
] as const;

function ContactContent() {
  const t = useTranslations("pages.contact");
  const tc = useTranslations("contactChannels");

  const emailHref = mailtoHref(tc("mailSubject"), tc("mailBody"));
  const whatsAppUrl = whatsappHref(tc("whatsappPrefill"));

  return (
    <>
      <PageHero
        image="/img/photos/sunset_yard.jpg"
        alt="Il cortile della cascina al tramonto"
        subtitle={t("hero.subtitle")}
        title={t("hero.title")}
        tagline={t("hero.tagline")}
      />

      {/* Intro + contact cards */}
      <section className="w-full bg-neutral-50 py-16 md:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-sans text-xs tracking-[0.3em] text-secondary-600 uppercase mb-4 block font-semibold">
            {t("intro.eyebrow")}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-neutral-950 mb-8">
            {t("intro.title")}
          </h2>
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light">
            {t("intro.body")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:col-span-2 flex items-center gap-5 p-7 bg-primary-500/10 rounded-[40px_8px_40px_8px] border border-primary-500/30 hover:border-primary-500/70 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-primary-500 text-neutral-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HugeiconsIcon icon={WhatsappIcon} className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-semibold mb-1">
                {t("cards.whatsapp")}
              </span>
              <span className="font-serif text-xl text-neutral-950 block leading-snug">
                {PHONE_DISPLAY}
              </span>
              <span className="text-sm text-neutral-600">
                {t("cards.whatsappNote")}
              </span>
            </div>
          </a>

          <a
            href={PHONE_HREF}
            className="flex items-center gap-5 p-7 bg-secondary-50/60 rounded-[40px_8px_40px_8px] border border-neutral-200/60 hover:border-primary-500/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-primary-500 text-neutral-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HugeiconsIcon icon={CallIcon} className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <span className="block text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-semibold mb-1">
                {t("cards.phone")}
              </span>
              <span className="font-serif text-xl text-neutral-950">
                {PHONE_DISPLAY}
              </span>
            </div>
          </a>

          <a
            href={emailHref}
            className="flex items-center gap-5 p-7 bg-secondary-50/60 rounded-[8px_40px_8px_40px] border border-neutral-200/60 hover:border-primary-500/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-primary-500 text-neutral-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HugeiconsIcon icon={Mail01Icon} className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-semibold mb-1">
                {t("cards.email")}
              </span>
              <span className="font-serif text-lg text-neutral-950 break-all">
                {EMAIL}
              </span>
            </div>
          </a>

          <div className="flex items-center gap-5 p-7 bg-secondary-50/60 rounded-[8px_40px_8px_40px] border border-neutral-200/60">
            <div className="w-12 h-12 rounded-full bg-secondary-600 text-neutral-50 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={MapsLocation01Icon} className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <span className="block text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-semibold mb-1">
                {t("cards.address")}
              </span>
              <span className="font-serif text-lg text-neutral-950 leading-snug block">
                {t("cards.addressLine1")}
              </span>
              <span className="text-sm text-neutral-600">{t("cards.addressLine2")}</span>
            </div>
          </div>

          <div className="flex items-center gap-5 p-7 bg-secondary-50/60 rounded-[40px_8px_40px_8px] border border-neutral-200/60">
            <div className="w-12 h-12 rounded-full bg-secondary-600 text-neutral-50 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Clock01Icon} className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <span className="block text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-semibold mb-1">
                {t("cards.hours")}
              </span>
              <span className="font-serif text-lg text-neutral-950 leading-snug block">
                {t("cards.hoursValue")}
              </span>
              <span className="text-sm text-neutral-600">{t("cards.hoursNote")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* How to reach us */}
      <section className="w-full bg-primary-500/5 py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase text-primary-500 text-center mb-14">
            {t("directions.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DIRECTIONS.map(({ key, icon }) => (
              <div
                key={key}
                className="flex flex-col items-center text-center p-8 bg-neutral-50 rounded-[40px_8px_40px_8px] shadow-sm border border-neutral-200/60"
              >
                <div className="w-16 h-16 rounded-full border-2 border-primary-500 flex items-center justify-center mb-6 text-primary-500">
                  <HugeiconsIcon icon={icon} className="w-7 h-7" strokeWidth={1.3} />
                </div>
                <h3 className="font-serif text-xl tracking-wider uppercase text-neutral-950 mb-3">
                  {t(`directions.${key}.title`)}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-light">
                  {t(`directions.${key}.text`)}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs tracking-wider uppercase text-neutral-500 font-medium mt-12">
            {t("directions.note")}
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="w-full bg-secondary-50">
        <div className="w-full h-80 md:h-112.5 relative shadow-inner overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2817.348633800613!2d8.3228965!3d44.9772095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4787948ef5336e1b%3A0x600ba4974f88e404!2sVia%20della%20Pace%2C%2024%2C%2014030%20Montemagno%20AT!5e0!3m2!1sit!2sit!4v1716750000000!5m2!1sit!2sit"
            className="w-full h-full border-0 grayscale opacity-85 hover:grayscale-0 transition-all duration-700 ease-in-out"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t("map.title")}
          />
        </div>
      </section>

      {/* Closing call band */}
      <section className="w-full bg-primary-500 text-neutral-50 py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-4xl tracking-[0.15em] uppercase mb-6 leading-tight">
            {t("closing.title")}
          </h2>
          <p className="text-base md:text-lg text-secondary-50/90 leading-relaxed font-light mb-10 max-w-xl">
            {t("closing.body")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="bg-secondary-200 text-neutral-900 px-10 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-secondary-50 transition-colors shadow-md h-auto"
            >
              <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                {t("closing.whatsapp")}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-secondary-200 text-secondary-200 px-10 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-neutral-50/10 transition-colors h-auto bg-transparent"
            >
              <a href={PHONE_HREF}>{t("closing.call")}</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-secondary-200 text-secondary-200 px-10 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-neutral-50/10 transition-colors h-auto bg-transparent"
            >
              <a href={`mailto:${EMAIL}`}>{t("closing.email")}</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactContent />;
}
