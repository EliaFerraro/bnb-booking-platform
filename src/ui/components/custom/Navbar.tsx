import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/configuration/images.mjs";
import { STRUCTURE_NAME } from "@/configuration/site";
import { LanguagePicker } from "@/ui/components/custom/LanguagePicker";
import { Button } from "@/ui/components/shadcn/button";
import { NavbarLink } from "@/ui/components/custom/NavbarLink";
import { MobileSidebar } from "@/ui/components/custom/MobileSidebar";

export function Navbar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  return (
    <header className="w-full flex justify-between items-center bg-navbar-primary text-neutral-50 p-0">
      <MobileSidebar />
      <nav className="flex items-center">
        <Link href={`/${locale}`}>
          {/* In the header of every page, so it is never lazy-loaded. The
              intrinsic size is the 1440x1013 artwork; `w-*` scales it down and
              `h-auto` keeps Next from stretching it. */}
          <Image
            src={IMAGES.brand.logo}
            alt={t("logoAlt", { brand: STRUCTURE_NAME })}
            width={1440}
            height={1013}
            priority
            sizes="(min-width: 768px) 160px, 80px"
            className="w-20 md:w-40 h-auto"
          />
        </Link>
        <span className="hidden md:inline-flex">
          <NavbarLink href={`/${locale}/structure`} label={t("house")} />
          <NavbarLink href={`/${locale}/environment`} label={t("surroundings")} />
          <NavbarLink href={`/${locale}/services`} label={t("amenities")} />
          <NavbarLink href={`/${locale}/contact`} label={t("findus")} />
        </span>
      </nav>

      {
        /* This also is hidden for the moment */ false && (
          <Button
            className="hidden lg:block cursor-pointer"
            variant="secondary"
          >
            {t("checkAvailabilities")}
          </Button>
        )
      }

      <div className="flex items-center mr-2 md:mr-4 gap-2">
        <LanguagePicker />
      </div>
    </header>
  );
}
