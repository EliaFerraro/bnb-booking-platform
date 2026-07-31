import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/shadcn/button";
import Link from "next/link";

export function Monferrato() {
  const t = useTranslations("pages.homepage.monferrato");
  return (
    <section id="monferrato-section" className="w-full py-16 md:py-32 bg-primary-500/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20 items-center">
        <div
          className={`lg:col-span-7 aspect-4/3 md:aspect-auto md:h-137.5 w-full overflow-hidden shadow-xl group rounded-[48px_12px_48px_12px] md:rounded-[160px_16px_160px_16px]`}
        >
          <img
            className="w-full h-full object-cover transformtransition-transform duration-1000 ease-out"
            src="/img/photos/Il Monferrato.jpg"
            alt="Le colline del Monferrato"
          />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="font-sans text-xs tracking-[0.3em] text-primary-500 uppercase mb-3 block font-semibold">
            {t("subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-5 md:mb-8">
            {t("title")}
          </h2>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-6 md:mb-10 text-justify">
            {t("description")}
          </p>

          <div className="flex justify-start">
            <Link href="/environment">
              <Button
                variant="secondary"
                className="bg-primary-500 text-neutral-50 px-8 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-primary-700 transition-all cursor-pointer shadow-md h-auto"
              >
                {t("cta")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
