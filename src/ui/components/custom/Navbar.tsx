import Link from "next/link";
import { LanguagePicker } from "@/ui/components/custom/LanguagePicker";
import { Button } from "@/ui/components/shadcn/button";
import { NavbarLink } from "@/ui/components/custom/NavbarLink";
import { HugeiconsIcon } from "@hugeicons/react";
import { MenuIcon, UserCircleIcon } from "@hugeicons/core-free-icons";

export function Navbar() {
  return (
    <header className="w-full flex justify-between items-center bg-navbar-primary text-neutral-50 p-0">
      <Button className="md:hidden" variant="ghost">
        <HugeiconsIcon icon={MenuIcon} className="size-7" />
      </Button>
      <nav className="flex items-center">
        <Link href="/">
          <img
            src="/img/brand/logo.png"
            alt="B&B Logo"
            className="w-20 md:w-40"
          ></img>
        </Link>
        <span className="hidden md:inline-flex">
          <NavbarLink href="/structure" label="HOUSE" />
          <NavbarLink href="/environment" label="SURROUNDINGS" />
          <NavbarLink href="/services" label="AMENITIES" />
          <NavbarLink href="/contact" label="FIND US" />
        </span>
      </nav>

      {
        /* This also is hidden for the moment */ false && (
          <Button
            className="hidden lg:block cursor-pointer"
            variant="secondary"
          >
            CHECK AVAILABILITES
          </Button>
        )
      }

      <div className="flex items-center md:mr-4 gap-2">
        <div className="hidden md:block">
          <LanguagePicker />
        </div>

        {
          /* For the moment this is disabled until I set up authentication in next US. Remove opacity-0 and hidden to enable it */
          <Button variant="ghost" className="opacity-0 md:hidden">
            <HugeiconsIcon icon={UserCircleIcon} className="size-7" />
          </Button>
        }
      </div>
    </header>
  );
}
