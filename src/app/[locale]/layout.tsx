// app/[locale]/layout.tsx
import "../../style/main.css";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Navbar } from "@/ui/components/custom/Navbar";
import { Footer } from "@/ui/components/custom/Footer";
import { Map } from "@/app/[locale]/_components/Map";
import { ConsentProvider } from "@/ui/components/custom/ConsentProvider";
import { CookieBanner } from "@/ui/components/custom/CookieBanner";
import { Analytics } from "@/ui/components/custom/Analytics";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { SITE_URL, STRUCTURE_NAME } from "@/configuration/site";

const font = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

/**
 * This is the root layout: it owns <html>, so `lang` can be the locale actually
 * being served. A layout above it, at app/layout.tsx, would have no access to
 * the route params and could only ever hardcode one language.
 *
 * What follows is inherited by every page and then overridden field by field —
 * each page supplies its own title, description and canonical URL through
 * `buildMetadata`.
 */
export const metadata: Metadata = {
  // Makes the relative URLs in the Open Graph tags absolute. Scrapers never
  // resolve a relative path.
  metadataBase: new URL(SITE_URL),
  title: {
    default: STRUCTURE_NAME,
    template: `%s · ${STRUCTURE_NAME}`,
  },
  applicationName: STRUCTURE_NAME,
  manifest: "/manifest/site.webmanifest",
  icons: {
    icon: [
      { url: "/img/brand/favicon.ico", sizes: "any" },
      { url: "/img/brand/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/img/brand/apple-touch-icon.png",
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
    <html lang={locale}>
      <body className={`${font.variable} font-sans m-0 p-0 antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Dentro NextIntlClientProvider perché il banner e le preferenze
              usano useTranslations, e sopra Map e Footer perché entrambi
              leggono la scelta sui cookie. */}
          <ConsentProvider>
            {/* Ora puoi passare la lingua corrente alla Navbar per tradurre i menu! */}
            <Navbar />

            <main>{children}</main>

            {/* Sopra il footer su ogni pagina: la posizione è utile ovunque. */}
            <Map />

            <Footer />

            <CookieBanner />

            {/* Fuori dal gate del consenso di proposito: è misurazione di
                prima parte, senza cookie e senza nulla salvato sul dispositivo,
                quindi non rientra nell'art. 5(3) ePrivacy. Vedi
                configuration/analytics.ts. */}
            <Analytics />
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
