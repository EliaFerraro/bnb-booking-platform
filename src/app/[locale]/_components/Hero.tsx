import { useTranslations } from "next-intl";
import Image from "next/image";

export function Hero() {
  const t = useTranslations();
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden">
      <div className="z-10 text-neutral-50 relative top-20">
        <h1 className="text-center text-5xl md:text-7xl tracking-widest">
          IL RESPIRO DEL BORGO
        </h1>
        <div className="flex flex-col items-center text-base md:text-2xl mt-24 md:mt-40 tracking-widest text-center">
          <span>{t("pages.homepage.hero.subtitle.keywords")}</span>
          <span>{t("pages.homepage.hero.subtitle.slogan")}</span>
        </div>
      </div>

      {/* `priority` because this is the largest contentful paint on the site:
          left to lazy-load it would be fetched after everything else. */}
      <Image
        className="z-0 object-cover"
        src="/img/photos/yard-sunset.jpg"
        alt="Sunset yard"
        fill
        priority
        sizes="100vw"
      />
    </div>
  );
}
