import { Hero } from "./_components/Hero";
import { Room } from "./_components/Room";
import { House } from "./_components/House";
import { AboutUs } from "./_components/AboutUs";
import { Monferrato } from "./_components/Monferrato";
import { Breakfast } from "./_components/Breakfast";
import { Services } from "./_components/Services";
import { Reviews } from "./_components/Reviews";
import { Map } from "./_components/Map";
import { Montemagno } from "./_components/Montemagno";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <Hero />
      <Room />
      <House />
      <AboutUs />
      <Montemagno />
      <Monferrato />
      <Breakfast />
      <Services />
      <Reviews />
      <Map />
    </main>
  );
}
