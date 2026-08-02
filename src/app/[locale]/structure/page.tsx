import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageHero } from "../_components/PageHero";
import { PageCta } from "../_components/PageCta";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BedSingle01Icon,
  Bathtub01Icon,
  DoorIcon,
  MountainIcon,
  WifiIcon,
  TemperatureIcon,
} from "@hugeicons/core-free-icons";

const ROOM_AMENITIES = [
  { key: "bed", icon: BedSingle01Icon },
  { key: "bathroom", icon: Bathtub01Icon },
  { key: "entrance", icon: DoorIcon },
  { key: "view", icon: MountainIcon },
  { key: "wifi", icon: WifiIcon },
  { key: "climate", icon: TemperatureIcon },
] as const;

const HOUSE_FEATURES = ["veranda", "garden", "light", "slowness"] as const;
const SPECS = ["guests", "size", "bed", "checkin"] as const;
const GALLERY = [
  { src: "/img/photos/yard.jpg", altKey: "yard" },
  { src: "/img/photos/bedroom_corner.jpg", altKey: "room" },
  { src: "/img/photos/bathroom.jpg", altKey: "bathroom" },
  { src: "/img/photos/veranda.jpg", altKey: "veranda" },
] as const;

function StructureContent({ locale }: { locale: string }) {
  const t = useTranslations("pages.structure");

  return (
    <>
      <PageHero
        image="/img/photos/sunset_house.jpg"
        alt={t("images.hero")}
        subtitle={t("hero.subtitle")}
        title={t("hero.title")}
        tagline={t("hero.tagline")}
        accentClassName="text-secondary-300"
      />

      {/* Intro */}
      <section className="w-full bg-neutral-50 py-16 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-sans text-xs tracking-[0.3em] text-secondary-600 uppercase mb-4 block font-semibold">
            {t("intro.eyebrow")}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-neutral-950 mb-8">
            {t("intro.title")}
          </h2>
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-8">
            {t("intro.body")}
          </p>
          <blockquote className="font-serif italic text-xl md:text-2xl text-primary-500 leading-relaxed">
            &ldquo;{t("intro.quote")}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Shared spaces */}
      <section className="w-full py-16 md:py-24 bg-secondary-50/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20 items-center">
          <div className="lg:col-span-6 aspect-4/3 md:aspect-auto md:h-137.5 w-full overflow-hidden shadow-md rounded-[48px_12px_48px_12px] md:rounded-[160px_16px_160px_16px]">
            <img
              className="w-full h-full object-cover"
              src="/img/photos/Casa dall'alto.jpg"
              alt={t("images.spaces")}
            />
          </div>
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="font-sans text-xs tracking-[0.3em] text-secondary-600 uppercase mb-3 block font-semibold">
              {t("house.subtitle")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-5 md:mb-8">
              {t("house.title")}
            </h2>
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-6 md:mb-8 text-justify">
              {t("house.description")}
            </p>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-b border-neutral-200 py-6 text-xs tracking-wider uppercase text-neutral-600 font-medium">
              {HOUSE_FEATURES.map((f) => (
                <div key={f}>• {t(`house.features.${f}`)}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The room */}
      <section className="w-full py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20 items-center">
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
            <span className="font-sans text-xs tracking-[0.3em] text-primary-500 uppercase mb-3 block font-semibold">
              {t("room.subtitle")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-5 md:mb-8">
              {t("room.title")}
            </h2>
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-6 md:mb-8 text-justify">
              {t("room.description")}
            </p>
            <span className="font-sans text-[11px] tracking-[0.25em] text-neutral-500 uppercase mb-5 block font-semibold">
              {t("room.amenitiesTitle")}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {ROOM_AMENITIES.map(({ key, icon }) => (
                <div key={key} className="flex items-center gap-3">
                  <HugeiconsIcon
                    icon={icon}
                    className="w-5 h-5 text-primary-500 shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-xs tracking-wide uppercase text-neutral-700 font-medium">
                    {t(`room.amenities.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 aspect-4/3 md:aspect-auto md:h-150 w-full overflow-hidden shadow-md rounded-[12px_48px_12px_48px] md:rounded-[16px_160px_16px_160px]">
            <img
              className="w-full h-full object-cover"
              src="/img/photos/bedroom.jpg"
              alt={t("images.room")}
            />
          </div>
        </div>
      </section>

      {/* Specs strip */}
      <section className="w-full bg-primary-500 text-neutral-50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 text-center">
          {SPECS.map((s) => (
            <div key={s} className="flex flex-col items-center">
              <span className="font-serif text-2xl md:text-3xl text-secondary-100 font-semibold mb-2">
                {t(`specs.${s}.value`)}
              </span>
              <span className="text-[11px] tracking-[0.2em] uppercase text-secondary-50/80 font-medium">
                {t(`specs.${s}.label`)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="w-full bg-neutral-50 py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase text-primary-500 text-center mb-14">
            {t("gallery.title")}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {GALLERY.map((g, i) => (
              <div
                key={g.src}
                className={`overflow-hidden shadow-sm aspect-4/5 ${
                  i % 2 === 0
                    ? "rounded-[32px_10px_32px_10px] md:rounded-[80px_12px_80px_12px]"
                    : "rounded-[10px_32px_10px_32px] md:rounded-[12px_80px_12px_80px]"
                }`}
              >
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  src={g.src}
                  alt={t(`images.${g.altKey}`)}
                />
              </div>
            ))}
          </div>
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

export default async function StructurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StructureContent locale={locale} />;
}
