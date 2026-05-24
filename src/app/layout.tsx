import { NavbarLink } from "@/ui/components/custom/NavbarLink";
import "../style/main.css";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { LanguagePicker } from "@/ui/components/custom/LanguagePicker";
import { Button } from "@/ui/components/shadcn/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MenuIcon, UserCircleIcon } from "@hugeicons/core-free-icons";

const font = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.STRUCTURE_NAME,
  description: "Famiglia, natura e ospitalità. Il tuo B&B immerso nel verde.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font.variable} antialiased`}>
      <body className="m-0 p-0">
        <header className="w-full flex justify-between items-center bg-navbar-primary text-neutral-50 p-0">
          <Button className="md:hidden" variant="ghost">
            <HugeiconsIcon icon={MenuIcon} />
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

          <Button className="hidden lg:block" variant="default">
            CHECK AVAILABILITES
          </Button>

          <div className="flex items-center md:mr-4 gap-2">
            <div className="hidden md:block">
              <LanguagePicker />
            </div>

            <Button variant="ghost">
              <HugeiconsIcon icon={UserCircleIcon} size={44} />
            </Button>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
