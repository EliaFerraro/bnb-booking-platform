// app/[lang]/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Navbar } from "@/ui/components/custom/Navbar";
import { Footer } from "@/ui/components/custom/Footer";

const font = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.STRUCTURE_NAME,
  description: "Famiglia, natura e ospitalità. Il tuo B&B immerso nel verde.",
  icons: {
    icon: "/img/brand/favicon.ico",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  return (
    <div className={`${font.variable} font-sans`}>
      {/* Ora puoi passare la lingua corrente alla Navbar per tradurre i menu! */}
      <Navbar />

      <main>{children}</main>

      <Footer />
    </div>
  );
}
