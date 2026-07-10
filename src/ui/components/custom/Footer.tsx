import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MapsLocation01Icon,
  CallIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { LegalPolicyModal } from "@/ui/components/custom/LegalPolicyModal";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="w-full bg-[#707E54] text-neutral-50 py-16 px-6 md:px-12 lg:px-24 font-light text-xs tracking-wider">
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pb-12 border-b border-white/10 text-center">
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-3">
            <h4 className="font-serif text-[10px] tracking-[0.25em] uppercase text-[#E5DCC6]/80 font-semibold">
              {t("location.title")}
            </h4>
            <div className="flex flex-col items-center lg:items-start space-y-1 text-[13px] text-[#F2EFE9] tracking-wide">
              <div className="flex items-center space-x-2.5">
                <HugeiconsIcon
                  icon={MapsLocation01Icon}
                  className="w-4 h-4 text-[#E5DCC6]/80"
                  strokeWidth={1.5}
                />
                <span>{t("location.address")}</span>
              </div>
              <p className="pl-0 lg:pl-6 text-[#E5DCC6] font-medium uppercase text-xs tracking-widest">
                {t("location.city")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center px-4 border-y lg:border-y-0 lg:border-x border-white/10 py-6 lg:py-2">
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-[#E5DCC6] font-medium mb-3 block">
              {t("brand.name")}
            </span>
            <blockquote className="text-[#F2EFE9]/70 leading-relaxed font-serif italic text-[13px] tracking-wide max-w-xs">
              "{t("brand.tagline")}"
            </blockquote>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end space-y-3">
            <h4 className="font-serif text-[10px] tracking-[0.25em] uppercase text-[#E5DCC6]/80 font-semibold">
              {t("contact.title")}
            </h4>
            <div className="flex flex-col items-center lg:items-end space-y-2 text-[13px] text-[#F2EFE9] tracking-wide">
              <a
                href="tel:+393397096173"
                className="flex items-center space-x-2.5 hover:text-[#E5DCC6] transition-colors group"
              >
                <HugeiconsIcon
                  icon={CallIcon}
                  className="w-4 h-4 text-[#E5DCC6]/80 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
                <span>{t("contact.phone")}</span>
              </a>
              <a
                href="mailto:ilrespirodelborgobnb@gmail.com"
                className="flex items-center space-x-2.5 hover:text-[#E5DCC6] transition-colors group"
              >
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="w-4 h-4 text-[#E5DCC6]/80 group-hover:scale-110 transition-transform"
                  strokeWidth={1.5}
                />
                <span>{t("contact.email")}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="w-full pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-[10px] text-[#E5DCC6]/60 uppercase tracking-[0.15em]">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <span className="text-neutral-200">
              {t("legal.classification")}
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span>{t("legal.cin")}</span>
          </div>

          <LegalPolicyModal />
        </div>

        <div className="mt-12 text-[9px] text-neutral-400/50 tracking-[0.25em] text-center uppercase">
          {t("legal.copyright")}
        </div>
      </div>
    </footer>
  );
}
