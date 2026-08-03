import { Hero } from "./_components/Hero";
import { Room } from "./_components/Room";
import { House } from "./_components/House";
import { AboutUs } from "./_components/AboutUs";
import { Monferrato } from "./_components/Monferrato";
import { Breakfast } from "./_components/Breakfast";
import { Services } from "./_components/Services";
import { Reviews } from "./_components/Reviews";
import { Montemagno } from "./_components/Montemagno";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({ locale });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Frammento e non <main>: il layout avvolge già children in <main>, e due
  // <main> annidati non sono HTML valido. Le altre pagine fanno già così.
  return (
    <>
      <Hero />
      <Room />
      <House />
      <AboutUs />
      <Montemagno />
      <Monferrato />
      <Breakfast />
      <Services />
      <Reviews />
    </>
  );
}
