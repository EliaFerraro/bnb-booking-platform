import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/shadcn/button";
import Link from "next/link";

export function AboutUs() {
  const t = useTranslations("pages.homepage.aboutUs");
  return (
    <section className="w-full bg-secondary-400 py-16 px-4 md:px-8 lg:px-16 text-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase">
            {t("title")}
          </h2>
          <div className="h-px w-12 bg-secondary-600 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
          <div
            className={`w-full aspect-4/3 md:aspect-4/5 overflow-hidden shadow-sm order-1 rounded-[48px_12px_48px_12px] md:rounded-[160px_16px_160px_16px]`}
          >
            <img
              src="/img/photos/Lorenzo.jpg"
              alt="L'accoglienza in Monferrato"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col items-center text-center px-4 md:px-8 order-3 lg:order-2 py-6 lg:py-0">
            <p className="font-sans text-base md:text-lg leading-relaxed text-neutral-700 max-w-md mb-8">
              {t("description")}
            </p>

            <Link href="/contact">
              <Button
                variant="outline"
                className="font-serif uppercase tracking-wider text-sm rounded-full px-6 py-5 h-auto border-neutral-950 text-neutral-950 hover:bg-neutral-950/10 text-shadow-none cursor-pointer"
              >
                {t("cta")}
              </Button>
            </Link>
          </div>

          <div
            className={`w-full aspect-4/3 md:aspect-4/5 overflow-hidden shadow-sm order-2 lg:order-3 rounded-[12px_48px_12px_48px] md:rounded-[16px_160px_16px_160px]`}
          >
            <img
              src="/img/photos/Margherita.jpg"
              alt="La convivialità nella nostra cascina"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
