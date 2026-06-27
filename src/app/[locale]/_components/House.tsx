import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/shadcn/button";

export function House() {
  const t = useTranslations("pages.homepage.house");
  return (
    <section id="house-section" className="w-full py-32 bg-[#F2EFE9]/30">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div
          className={`lg:col-span-5 h-112.5 md:h-137.5 w-full overflow-hidden shadow-md group rounded-[160px_16px_160px_16px]`}
        >
          <img
            className="w-full h-full object-cover transform transition-transform duration-1000 ease-out"
            src="/img/photos/sunset_house.jpg"
            alt="Photo of the house"
          />
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center pl-0 lg:pl-10">
          <span className="font-sans text-xs tracking-[0.3em] text-[#a36527] uppercase mb-3 block font-semibold">
            {t("subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-8">
            {t("title")}
          </h2>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-8 text-justify">
            {t("description")}
          </p>

          <blockquote className="border-l-2 border-[#a36527] pl-4 italic text-neutral-600 text-sm mb-8 font-light">
            "{t("quote")}"
          </blockquote>

          <div className="flex justify-start">
            <Button
              variant="outline"
              className="border-neutral-950 text-neutral-950 px-8 py-5 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-neutral-950/5 transition-colors cursor-pointer h-auto"
            >
              {t("cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
