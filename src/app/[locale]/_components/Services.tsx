import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/shadcn/button";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  WifiIcon,
  WashingMachineIcon,
  ParkingAreaCircleIcon,
  TerraceIcon,
} from "@hugeicons/core-free-icons";

export function Services() {
  const t = useTranslations("pages.homepage.services");
  return (
    <section
      id="servizi-section"
      className="w-full bg-secondary-50 py-16 md:py-24 px-6 md:px-12 lg:px-24 text-neutral-950"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-20">
          <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase text-primary-500">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-16 items-center justify-items-center mb-10 md:mb-16">
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 md:w-28 md:h-28 rounded-full border-2 border-primary-500 flex items-center justify-center mb-4 md:mb-6 text-primary-500 transition-all duration-300 shadow-sm">
              <HugeiconsIcon
                icon={WifiIcon}
                className="w-7 h-7 md:w-12 md:h-12"
                strokeWidth={1.2}
              />
            </div>
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
              {t("wifi")}
            </span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 md:w-28 md:h-28 rounded-full border-2 border-primary-500 flex items-center justify-center mb-4 md:mb-6 text-primary-500 transition-all duration-300 shadow-sm">
              <HugeiconsIcon
                icon={WashingMachineIcon}
                className="w-7 h-7 md:w-12 md:h-12"
                strokeWidth={1.2}
              />
            </div>
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
              {t("laundry")}
            </span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 md:w-28 md:h-28 rounded-full border-2 border-primary-500 flex items-center justify-center mb-4 md:mb-6 text-primary-500 transition-all duration-300 shadow-sm">
              <HugeiconsIcon
                icon={ParkingAreaCircleIcon}
                className="w-7 h-7 md:w-12 md:h-12"
                strokeWidth={1.2}
              />
            </div>
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
              {t("parking")}
            </span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 md:w-28 md:h-28 rounded-full border-2 border-primary-500 flex items-center justify-center mb-4 md:mb-6 text-primary-500 transition-all duration-300 shadow-sm">
              <HugeiconsIcon
                icon={TerraceIcon}
                className="w-7 h-7 md:w-12 md:h-12"
                strokeWidth={1.2}
              />
            </div>
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
              {t("relaxArea")}
            </span>
          </div>
        </div>

        <div className="w-full flex justify-end mt-12">
          <Link href="/services">
            <Button
              variant="secondary"
              className="bg-primary-500 text-neutral-50 px-8 py-6 rounded-full text-xs font-medium tracking-[0.2em] uppercase hover:bg-primary-700 transition-all cursor-pointer shadow-md h-auto"
            >
              {t("discoverMore")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
