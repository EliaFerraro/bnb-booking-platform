// app/[lang]/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Navbar } from "@/ui/components/custom/Navbar";
import { Footer } from "@/ui/components/custom/Footer";
import { Map } from "@/app/[locale]/_components/Map";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

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
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  // Rende la lingua disponibile ai Server Components (es. Hero) che usano useTranslations().
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className={`${font.variable} font-sans`}>
        {/* Ora puoi passare la lingua corrente alla Navbar per tradurre i menu! */}
        <Navbar />

        <main>{children}</main>

        {/* Sopra il footer su ogni pagina: la posizione è utile ovunque. */}
        <Map />

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
