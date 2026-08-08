import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/shadcn/button";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/configuration/images.mjs";

/** Village trivia, in the order it is shown. Same shape the environment page uses. */
const FEATURES = ["alleys", "square", "distance"] as const;

export function Montemagno() {
  const t = useTranslations("pages.homepage.montemagno");
  const ti = useTranslations("pages.homepage.images");
  return (
    <section id="montemagno-section" className="w-full py-16 md:py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20 items-center">
        <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
          <span className="font-sans text-xs tracking-[0.3em] text-primary-500 uppercase mb-3 block font-semibold">
            {t("subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-5 md:mb-8">
            {t("title")}
          </h2>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-6 md:mb-8 text-justify">
            {t("description")}
          </p>

          <div className="flex items-center space-x-6 text-xs tracking-wider uppercase text-neutral-500 font-medium mb-10">
            {FEATURES.map((key, i) => (
              <Fragment key={key}>
                {i > 0 && <div className="h-8 w-px bg-neutral-300" />}
                <div className="flex flex-col">
                  <span className="text-xl font-serif text-neutral-950 font-semibold mb-1">
                    {t(`features.${key}.value`)}
                  </span>
                  <span>{t(`features.${key}.label`)}</span>
                </div>
              </Fragment>
            ))}
          </div>

          <div className="flex justify-start">
            <Link href="/environment">
              <Button
                variant="secondary"
                className="bg-neutral-900 text-neutral-50 px-8 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer h-auto"
              >
                {t("cta")}
              </Button>
            </Link>
          </div>
        </div>

        <div
          className={`relative lg:col-span-6 order-1 lg:order-2 aspect-4/3 md:aspect-auto md:h-150 w-full overflow-hidden shadow-lg group rounded-[12px_48px_12px_48px] md:rounded-[16px_160px_16px_160px]`}
        >
          <Image
            className="object-cover transition-transform duration-1000 ease-out"
            src={IMAGES.home.village}
            alt={ti("village")}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
