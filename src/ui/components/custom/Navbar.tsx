import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { LanguagePicker } from "@/ui/components/custom/LanguagePicker";
import { Button } from "@/ui/components/shadcn/button";
import { NavbarLink } from "@/ui/components/custom/NavbarLink";
import { MobileSidebar } from "@/ui/components/custom/MobileSidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserCircleIcon } from "@hugeicons/core-free-icons";

export function Navbar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  return (
    <header className="w-full flex justify-between items-center bg-navbar-primary text-neutral-50 p-0">
      <MobileSidebar />
      <nav className="flex items-center">
        <Link href={`/${locale}`}>
          <img
            src="/img/brand/logo.png"
            alt="B&B Logo"
            className="w-20 md:w-40"
          ></img>
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

      <div className="flex items-center md:mr-4 gap-2">
        <div className="hidden md:block">
          <LanguagePicker />
        </div>

        {
          <Button variant="ghost" className="opacity-0 md:hidden">
            <HugeiconsIcon icon={UserCircleIcon} className="size-7" />
          </Button>
        }
      </div>
    </header>
  );
}
