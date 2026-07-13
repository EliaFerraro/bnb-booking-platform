import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageHero } from "../_components/PageHero";
import { PageCta } from "../_components/PageCta";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CoffeeIcon,
  CheeseCake01Icon,
  NaturalFoodIcon,
  WifiIcon,
  ParkingAreaCircleIcon,
  WashingMachineIcon,
  TerraceIcon,
  Leaf01Icon,
  TowelsIcon,
  TemperatureIcon,
  MapsLocation01Icon,
} from "@hugeicons/core-free-icons";

const BREAKFAST_FEATURES = [
  { key: "coffee", icon: CoffeeIcon },
  { key: "pastries", icon: CheeseCake01Icon },
  { key: "local", icon: NaturalFoodIcon },
] as const;

const INCLUDED = [
  { key: "wifi", icon: WifiIcon },
  { key: "parking", icon: ParkingAreaCircleIcon },
  { key: "garden", icon: Leaf01Icon },
  { key: "laundry", icon: WashingMachineIcon },
  { key: "linen", icon: TowelsIcon },
  { key: "relax", icon: TerraceIcon },
  { key: "climate", icon: TemperatureIcon },
  { key: "tips", icon: MapsLocation01Icon },
] as const;

const ON_REQUEST = ["basket", "tastings", "bikes", "transfer", "pets", "late"] as const;

function ServicesContent({ locale }: { locale: string }) {
  const t = useTranslations("pages.services");

  return (
    <>
      <PageHero
        image="/img/photos/Casa con colazione.jpg"
        alt="La colazione servita in giardino"
        subtitle={t("hero.subtitle")}
        title={t("hero.title")}
        tagline={t("hero.tagline")}
      />

      {/* Intro */}
      <section className="w-full bg-neutral-50 py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-sans text-xs tracking-[0.3em] text-primary-500 uppercase mb-4 block font-semibold">
            {t("intro.eyebrow")}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-neutral-950 mb-8">
            {t("intro.title")}
          </h2>
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light">
            {t("intro.body")}
          </p>
        </div>
      </section>

      {/* Breakfast feature (sage band) */}
      <section className="w-full bg-primary-500 py-24 px-6 md:px-12 lg:px-24 text-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 w-full aspect-4/3 lg:aspect-[1.1] overflow-hidden shadow-xl rounded-[160px_16px_160px_16px] order-1">
            <img
              className="w-full h-full object-cover object-center"
              src="/img/photos/Casa con colazione.jpg"
              alt="Tavola della colazione all'aperto"
            />
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center order-2">
            <span className="font-sans text-xs md:text-sm tracking-[0.3em] text-secondary-200 uppercase mb-3 block font-medium">
              {t("breakfast.subtitle")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-[0.15em] uppercase mb-8 leading-tight">
              {t("breakfast.title")}
            </h2>
            <p className="text-base md:text-lg text-secondary-50 leading-relaxed font-light mb-10 text-justify max-w-2xl">
              {t("breakfast.description")}
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-neutral-50/20 pt-8 max-w-xl">
              {BREAKFAST_FEATURES.map(({ key, icon }) => (
                <div key={key} className="flex flex-col items-center text-center p-2">
                  <HugeiconsIcon
                    icon={icon}
                    className="text-secondary-200 mb-2 w-6 h-6"
                    strokeWidth={1.5}
                  />
                  <span className="text-xs tracking-wider uppercase font-medium text-secondary-200">
                    {t(`breakfast.features.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Included services grid */}
      <section className="w-full bg-secondary-50 py-24 px-6 md:px-12 lg:px-24 text-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-sans text-xs tracking-[0.3em] text-secondary-600 uppercase mb-3 block font-semibold">
              {t("included.eyebrow")}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase text-primary-500">
              {t("included.title")}
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14 items-start justify-items-center">
            {INCLUDED.map(({ key, icon }) => (
              <div key={key} className="flex flex-col items-center text-center max-w-44">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary-500 flex items-center justify-center mb-5 text-primary-500 shadow-sm">
                  <HugeiconsIcon
                    icon={icon}
                    className="w-9 h-9 md:w-10 md:h-10"
                    strokeWidth={1.2}
                  />
                </div>
                <span className="text-xs md:text-sm tracking-[0.15em] uppercase font-semibold text-neutral-800 mb-2">
                  {t(`included.${key}.title`)}
                </span>
                <span className="text-xs text-neutral-600 leading-relaxed font-light">
                  {t(`included.${key}.text`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* On request */}
      <section className="w-full bg-neutral-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="font-sans text-xs tracking-[0.3em] text-secondary-600 uppercase mb-3 block font-semibold">
              {t("onRequest.eyebrow")}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase text-primary-500">
              {t("onRequest.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {ON_REQUEST.map((key) => (
              <div
                key={key}
                className="flex gap-4 border-b border-neutral-200 pb-6"
              >
                <span className="font-serif text-2xl text-secondary-600 leading-none">—</span>
                <div>
                  <h3 className="font-serif text-lg tracking-wide uppercase text-neutral-950 mb-1">
                    {t(`onRequest.${key}.title`)}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-light">
                    {t(`onRequest.${key}.text`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs tracking-wider uppercase text-neutral-500 font-medium mt-12">
            {t("onRequest.note")}
          </p>
        </div>
      </section>

      <PageCta
        title={t("cta.title")}
        body={t("cta.body")}
        button={t("cta.button")}
        href={`/${locale}/contact`}
        variant="sage"
      />
    </>
  );
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesContent locale={locale} />;
}
