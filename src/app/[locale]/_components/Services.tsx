import { useTranslations } from "next-intl";
import { Button } from "@/ui/components/shadcn/button";
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
      className="w-full bg-[#F2EFE9] py-24 px-6 md:px-12 lg:px-24 text-neutral-950"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20">
          <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase text-[#707E54]">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 items-center justify-items-center mb-16">
          <div className="flex flex-col items-center group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#707E54] flex items-center justify-center mb-6 text-[#707E54] transition-all duration-300 group-hover:bg-[#707E54] group-hover:text-neutral-50 shadow-sm">
              <HugeiconsIcon
                icon={WifiIcon}
                className="w-10 h-10 md:w-12 md:h-12"
                strokeWidth={1.2}
              />
            </div>
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
              {t("wifi")}
            </span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#707E54] flex items-center justify-center mb-6 text-[#707E54] transition-all duration-300 group-hover:bg-[#707E54] group-hover:text-neutral-50 shadow-sm">
              <HugeiconsIcon
                icon={WashingMachineIcon}
                className="w-10 h-10 md:w-12 md:h-12"
                strokeWidth={1.2}
              />
            </div>
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
              {t("laundry")}
            </span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#707E54] flex items-center justify-center mb-6 text-[#707E54] transition-all duration-300 group-hover:bg-[#707E54] group-hover:text-neutral-50 shadow-sm">
              <HugeiconsIcon
                icon={ParkingAreaCircleIcon}
                className="w-10 h-10 md:w-12 md:h-12"
                strokeWidth={1.2}
              />
            </div>
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
              {t("parking")}
            </span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#707E54] flex items-center justify-center mb-6 text-[#707E54] transition-all duration-300 group-hover:bg-[#707E54] group-hover:text-neutral-50 shadow-sm">
              <HugeiconsIcon
                icon={TerraceIcon}
                className="w-10 h-10 md:w-12 md:h-12"
                strokeWidth={1.2}
              />
            </div>
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
              {t("relaxArea")}
            </span>
          </div>
        </div>

        <div className="w-full flex justify-end mt-12">
          <Button
            variant="secondary"
            className="bg-[#707E54] text-neutral-50 px-8 py-6 rounded-full text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#5b6843] transition-all cursor-pointer shadow-md h-auto"
          >
            {t("discoverMore")}
          </Button>
        </div>
      </div>
    </section>
  );
}
