"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/ui/components/shadcn/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MenuIcon, Cancel01Icon } from "@hugeicons/core-free-icons";

export function MobileSidebar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}/structure`, label: t("house") },
    { href: `/${locale}/environment`, label: t("surroundings") },
    { href: `/${locale}/services`, label: t("amenities") },
    { href: `/${locale}/contact`, label: t("findus") },
  ];

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" onClick={() => setOpen(true)} aria-label="Open menu">
        <HugeiconsIcon icon={MenuIcon} className="size-7" />
      </Button>

      {/* Backdrop: closes the sidebar when clicking outside its scope */}
      <div
        onClick={close}
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sliding sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80%] flex-col bg-navbar-primary text-neutral-50 shadow-xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex items-center justify-center p-4">
          <Link href={`/${locale}`} onClick={close}>
            <img src="/img/brand/logo.png" alt="B&B Logo" className="w-28" />
          </Link>
          <Button
            variant="ghost"
            onClick={close}
            aria-label="Close menu"
            className="absolute right-2 top-2"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-7" />
          </Button>
        </div>

        <nav className="flex flex-col">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="px-6 py-4 uppercase transition-colors duration-300 ease-in-out hover:bg-primary-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
