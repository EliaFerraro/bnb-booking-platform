import { NavbarLink } from "@/ui/components/navbar/NavbarLink";
import "../style/main.css";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";

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
          <nav className="flex items-center">
            <Link href="/">
              <img
                src="/img/brand/logo.png"
                alt="B&B Logo"
                className="w-40"
              ></img>
            </Link>
            <NavbarLink href="/structure" label="THE STRUCTURE" />
            <NavbarLink href="/environment" label="ENVIRONMENT" />
            <NavbarLink href="/services" label="SERVICES" />
            <NavbarLink href="/contact" label="CONTACT" />
          </nav>

          <div></div>
        </header>

        {children}
      </body>
    </html>
  );
}
