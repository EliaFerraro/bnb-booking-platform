import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/shadcn/button";
import Link from "next/link";

export function Room() {
  const t = useTranslations("pages.homepage.room");
  return (
    <section id="room-section" className="w-full py-16 md:py-32 bg-neutral-50/50">
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

          <div className="grid grid-cols-2 gap-4 border-t border-b border-neutral-200 py-6 mb-10 text-xs tracking-wider uppercase text-neutral-600 font-medium">
            <div>• {t("features.furniture")}</div>
            <div>• {t("features.entrance")}</div>
            <div>• {t("features.view")}</div>
            <div>• {t("features.bathroom")}</div>
          </div>

          <div className="flex justify-start">
            <Link href="/structure">
              <Button
                variant="secondary"
                className="bg-neutral-950 text-neutral-50 px-8 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm h-auto"
              >
                {t("cta")}
              </Button>
            </Link>
          </div>
        </div>

        <div
          className={`lg:col-span-6 order-1 lg:order-2 aspect-4/3 md:aspect-auto md:h-150 w-full overflow-hidden shadow-md group rounded-[12px_48px_12px_48px] md:rounded-[16px_160px_16px_160px]`}
        >
          <img
            className="w-full h-full object-cover transform transition-transform duration-1000 ease-out"
            src="/img/photos/room-detail.jpg"
            alt="Photo of the room"
          />
        </div>
      </div>
    </section>
  );
}
