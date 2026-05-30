import { Hero } from "./_components/Hero";
import { Room } from "./_components/Room";
import { House } from "./_components/House";
import { AboutUs } from "./_components/AboutUs";
import { Monferrato } from "./_components/Monferrato";
import { Breakfast } from "./_components/Breakfast";
import { Services } from "./_components/Services";
import { Map } from "./_components/Map";
import { Montemagno } from "./_components/Montemagno";

export default function Home() {
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
      <Map />
    </main>
  );
}
