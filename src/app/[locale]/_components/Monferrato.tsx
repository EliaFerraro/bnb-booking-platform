import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/shadcn/button";

export function Monferrato() {
  const t = useTranslations("pages.homepage.monferrato");
  return (
    <section id="monferrato-section" className="w-full py-32 bg-[#707E54]/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div
          className={`lg:col-span-7 h-100 md:h-137.5 w-full overflow-hidden shadow-xl group rounded-[160px_16px_160px_16px]`}
        >
          <img
            className="w-full h-full object-cover transformtransition-transform duration-1000 ease-out"
            src="/img/photos/Il Monferrato.jpg"
            alt="Le colline del Monferrato"
          />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="font-sans text-xs tracking-[0.3em] text-[#707E54] uppercase mb-3 block font-semibold">
            {t("subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-8">
            {t("title")}
          </h2>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-10 text-justify">
            {t("description")}
          </p>

          <div className="flex justify-start">
            <Button
              variant="secondary"
              className="bg-[#707E54] text-neutral-50 px-8 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-[#5b6843] transition-all cursor-pointer shadow-md h-auto"
            >
              {t("cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
