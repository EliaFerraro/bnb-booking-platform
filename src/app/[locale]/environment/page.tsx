import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageHero } from "../_components/PageHero";
import { PageCta } from "../_components/PageCta";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GrapesIcon,
  WalkingIcon,
  DiningTableIcon,
  Castle01Icon,
} from "@hugeicons/core-free-icons";

const MONTEMAGNO_STATS = ["alleys", "castle", "distance"] as const;
const EXPERIENCES = [
  { key: "wine", icon: GrapesIcon },
  { key: "walks", icon: WalkingIcon },
  { key: "food", icon: DiningTableIcon },
  { key: "culture", icon: Castle01Icon },
] as const;
const GALLERY = [
  { src: "/img/photos/Montemagno.jpeg", alt: "Il borgo di Montemagno" },
  { src: "/img/photos/Il Monferrato.jpg", alt: "Le colline del Monferrato" },
  { src: "/img/photos/Aperitivo.png", alt: "Aperitivo tra le vigne" },
  { src: "/img/photos/sunset_yard.jpg", alt: "Tramonto sulle colline" },
];

function EnvironmentContent({ locale }: { locale: string }) {
  const t = useTranslations("pages.environment");

  return (
    <>
      <PageHero
        image="/img/photos/Il Monferrato.jpg"
        alt="Le colline del Monferrato"
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
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-8">
            {t("intro.body")}
          </p>
          <blockquote className="font-serif italic text-xl md:text-2xl text-primary-500 leading-relaxed">
            "{t("intro.quote")}"
          </blockquote>
        </div>
      </section>

      {/* Montemagno */}
      <section className="w-full py-24 bg-secondary-50/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
            <span className="font-sans text-xs tracking-[0.3em] text-primary-500 uppercase mb-3 block font-semibold">
              {t("montemagno.subtitle")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-8">
              {t("montemagno.title")}
            </h2>
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-8 text-justify">
              {t("montemagno.description")}
            </p>
            <div className="flex items-center gap-6 text-xs tracking-wider uppercase text-neutral-500 font-medium">
              {MONTEMAGNO_STATS.map((s, i) => (
                <div key={s} className="flex items-center gap-6">
                  {i > 0 && <div className="h-8 w-px bg-neutral-300" />}
                  <div className="flex flex-col">
                    <span className="text-xl font-serif text-neutral-950 font-semibold mb-1">
                      {t(`montemagno.stats.${s}.value`)}
                    </span>
                    <span>{t(`montemagno.stats.${s}.label`)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 h-125 md:h-150 w-full overflow-hidden shadow-lg rounded-[16px_160px_16px_160px]">
            <img
              className="w-full h-full object-cover"
              src="/img/photos/Montemagno.jpeg"
              alt="Il borgo di Montemagno"
            />
          </div>
        </div>
      </section>

      {/* Monferrato */}
      <section className="w-full py-24 bg-primary-500/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7 h-100 md:h-137.5 w-full overflow-hidden shadow-xl rounded-[160px_16px_160px_16px]">
            <img
              className="w-full h-full object-cover"
              src="/img/photos/Il Monferrato.jpg"
              alt="Le colline del Monferrato"
            />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-sans text-xs tracking-[0.3em] text-primary-500 uppercase mb-3 block font-semibold">
              {t("monferrato.subtitle")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-8">
              {t("monferrato.title")}
            </h2>
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light text-justify">
              {t("monferrato.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="w-full bg-neutral-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase text-primary-500 text-center mb-14">
            {t("experiences.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {EXPERIENCES.map(({ key, icon }) => (
              <div
                key={key}
                className="flex flex-col items-center text-center p-8 bg-secondary-50/50 rounded-[40px_8px_40px_8px] border border-neutral-200/60"
              >
                <div className="w-16 h-16 rounded-full border-2 border-primary-500 flex items-center justify-center mb-6 text-primary-500">
                  <HugeiconsIcon icon={icon} className="w-7 h-7" strokeWidth={1.3} />
                </div>
                <h3 className="font-serif text-xl tracking-wider uppercase text-neutral-950 mb-3">
                  {t(`experiences.${key}.title`)}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-light">
                  {t(`experiences.${key}.text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="w-full bg-secondary-50/40 py-24 px-6">
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
                    ? "rounded-[80px_12px_80px_12px]"
                    : "rounded-[12px_80px_12px_80px]"
                }`}
              >
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  src={g.src}
                  alt={g.alt}
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
        variant="sand"
      />
    </>
  );
}

export default async function EnvironmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EnvironmentContent locale={locale} />;
}
