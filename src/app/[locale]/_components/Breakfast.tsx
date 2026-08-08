import { useTranslations } from "next-intl";
import Image from "next/image";
import { IMAGES } from "@/configuration/images.mjs";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CoffeeIcon,
  CheeseCake01Icon,
  NaturalFoodIcon,
} from "@hugeicons/core-free-icons";

export function Breakfast() {
  const t = useTranslations("pages.homepage.breakfast");
  const ti = useTranslations("pages.homepage.images");
  return (
    <section
      id="breakfast-section"
      className="w-full bg-primary-500 py-16 md:py-24 px-6 md:px-12 lg:px-24 text-neutral-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <span className="font-sans text-xs md:text-sm tracking-[0.3em] text-secondary-200 uppercase mb-3 block font-medium">
            {t("subtitle")}
          </span>

          <h2 className="text-4xl md:text-5xl font-serif tracking-[0.15em] uppercase mb-8 leading-tight">
            {t("title")}
          </h2>

          <p className="text-base md:text-lg text-secondary-50 leading-relaxed font-light mb-10 text-justify max-w-2xl">
            {t("description")}
          </p>

          <div className="grid grid-cols-3 gap-4 border-t border-neutral-50/20 pt-8 max-w-xl">
            <div className="flex flex-col items-center text-center p-2">
              <HugeiconsIcon
                icon={CoffeeIcon}
                className="text-secondary-200 mb-2 w-6 h-6"
                strokeWidth={1.5}
              />
              <span className="text-xs tracking-wider uppercase font-medium text-secondary-200">
                {t("features.coffee")}
              </span>
            </div>

            <div className="flex flex-col items-center text-center p-2">
              <HugeiconsIcon
                icon={CheeseCake01Icon}
                className="text-secondary-200 mb-2 w-6 h-6"
                strokeWidth={1.5}
              />
              <span className="text-xs tracking-wider uppercase font-medium text-secondary-200">
                {t("features.pastries")}
              </span>
            </div>

            <div className="flex flex-col items-center text-center p-2">
              <HugeiconsIcon
                icon={NaturalFoodIcon}
                className="text-secondary-200 mb-2 w-6 h-6"
                strokeWidth={1.5}
              />
              <span className="text-xs tracking-wider uppercase font-medium text-secondary-200">
                {t("features.local")}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`relative lg:col-span-5 w-full aspect-4/3 sm:aspect-video lg:aspect-[1.1] overflow-hidden shadow-xl rounded-[12px_48px_12px_48px] md:rounded-[16px_160px_16px_160px]`}
        >
          <Image
            className="object-cover object-center transition-transform duration-700 ease-out"
            src={IMAGES.home.breakfast}
            alt={ti("breakfast")}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
