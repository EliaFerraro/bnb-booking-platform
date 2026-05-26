import { Button } from "@/ui/components/shadcn/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BarrelIcon,
  RestaurantIcon,
  TreesIcon,
  WifiIcon,
  WashingMachineIcon,
  ParkingAreaCircleIcon,
  TerraceIcon,
  MapsLocation01Icon,
  CallIcon,
  Mail01Icon,
  InstagramIcon,
} from "@hugeicons/core-free-icons";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <div
        id="hero-section"
        className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden"
      >
        <div className="z-10 text-neutral-50 relative top-20">
          <h1 className="text-center text-5xl md:text-7xl tracking-widest">
            IL RESPIRO DEL BORGO
          </h1>
          <div className="flex flex-col items-center text-base md:text-2xl mt-40 tracking-widest text-center">
            <span>FAMIGLIA, NATURA E OSPITALITA'</span>
            <span>IL TUO B&B IMMERSO NEL VERDE</span>
          </div>
        </div>

        <img
          className="absolute top-0 left-0 z-0 object-cover object-[20%] w-full h-full"
          src="/img/photos/sunset_yard.jpg"
          alt="Sunset yard"
        />
      </div>

      <div className="w-full h-40" />

      {/* Room Section */}
      <div id="room-section" className="w-full py-24 pl-6 overflow-hidden">
        <div className="float-right w-full md:w-1/2 h-87 md:h-125 ml-6 mb-6 rounded-l-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="/img/photos/room.jpg"
            alt="Photo of the room"
          />
        </div>

        <div className="max-w-3xl flex flex-col">
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-12">
            The Room
          </h2>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-12 text-justify">
            Arredata con pezzi autentici della tradizione contadina e finiture
            curate, la nostra camera offre un comfort raffinato senza tradire lo
            spirito originario della "casa della nonna". Un ambiente intimo e
            silenzioso, pensato per regalare un riposo profondo e rigenerante,
            lontano dal frenetico ritmo quotidiano.
          </p>

          <Button
            variant="secondary"
            className="bg-secondary-200 text-secondary-950 px-8 py-6 mx-auto rounded-full text-sm font-medium tracking-wider uppercase hover:bg-secondary-300 transition-colors cursor-pointer shadow-sm h-auto"
          >
            Discover the refuge
          </Button>
        </div>
      </div>

      {/* House Section */}
      <div
        id="house-section"
        className="w-full py-24 pr-6 overflow-hidden flex justify-between"
      >
        <div className="float-left w-full md:w-1/2 min-w-1/2 h-87 md:h-125 mr-6 mb-6 rounded-r-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="/img/photos/sunset_house.jpg"
            alt="Photo of the house"
          />
        </div>

        <div className="max-w-3xl flex flex-col items-end">
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-12 text-right">
            The house
          </h2>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-12 text-justify">
            La struttura conserva intatto il fascino delle antiche cascine
            piemontesi, caratterizzata da una solida architettura in pietra e
            mattoni a vista. Gli ampi spazi comuni e il cortile fiorito sono
            pensati per condividere momenti di autentica convivialità, dalle
            prime luci della colazione fino a un bicchiere di vino al tramonto.
          </p>

          <Button
            variant="secondary"
            className="bg-secondary-200 text-secondary-950 px-8 py-6 mx-auto rounded-full text-sm font-medium tracking-wider uppercase hover:bg-secondary-300 transition-colors cursor-pointer shadow-sm h-auto"
          >
            Visit an old house
          </Button>
        </div>
      </div>

      {/* Chi Siamo Section */}
      <section className="w-full bg-secondary-400 py-16 px-4 md:px-8 lg:px-16 text-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase">
              Chi Siamo
            </h2>
            <div className="h-px w-12 bg-[#a36527] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Foto Sinistra */}
            <div className="w-full aspect-4/5 overflow-hidden rounded-[60px_4px_60px_4px] shadow-sm order-1">
              <img
                src="/img/photos/Lorenzo.jpg"
                alt="L'accoglienza in Monferrato"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Testo Centrale */}
            <div className="flex flex-col items-center text-center px-4 md:px-8 order-3 lg:order-2 py-6 lg:py-0">
              <p className="font-sans text-base md:text-lg leading-relaxed text-gray-700 max-w-md mb-8">
                La mia famiglia ed io vi accogliamo con calore nel nostro
                rifugio storico nel cuore del Monferrato, offrendo un'esperienza
                autentica immersa tra le pievi e le colline, dove la storia, la
                natura e la cultura si fondono armoniosamente.
              </p>

              <Button
                variant="outline"
                className="font-serif uppercase tracking-wider text-sm rounded-full px-6 py-5 h-auto border-neutral-950 text-neutral-950 hover:bg-neutral-950/10 [text-shadow:none]"
              >
                Scopri la nostra storia
              </Button>
            </div>

            {/* Foto Destra */}
            <div className="w-full aspect-4/5 overflow-hidden rounded-[4px_60px_4px_60px] shadow-sm order-2 lg:order-3">
              <img
                src="/img/photos/Margherita.jpg"
                alt="La convivialità nella nostra cascina"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Montemagno Section */}
      <div
        id="montemagno-section"
        className="w-full py-24 pl-6 overflow-hidden"
      >
        <div className="float-right w-full md:w-1/2 h-87 md:h-125 ml-6 mb-6 rounded-l-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="/img/photos/Montemagno.jpeg"
            alt="Il borgo di Montemagno"
          />
        </div>

        <div className="max-w-3xl flex flex-col">
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-12">
            Montemagno
          </h2>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-12 text-justify">
            Arroccato sulla collina, Montemagno è un borgo medievale unico nel
            suo genere, celebre per il suo caratteristico impianto urbano a
            mandorla e i suoi dodici vicoli storici. Passeggiare tra le sue
            strade significa fare un salto indietro nel tempo, ammirando
            l'imponente castello merlato che domina silenzioso la vallata
            circostante.
          </p>

          <Button
            variant="secondary"
            className="bg-secondary-200 text-secondary-950 px-8 py-6 mx-auto rounded-full text-sm font-medium tracking-wider uppercase hover:bg-secondary-300 transition-colors cursor-pointer shadow-sm h-auto"
          >
            Explore the medieval village
          </Button>
        </div>
      </div>

      {/* Il Monferrato Section */}
      <div
        id="monferrato-section"
        className="w-full py-24 pr-6 overflow-hidden flex justify-between"
      >
        <div className="float-left w-full md:w-1/2 min-w-1/2 h-87 md:h-125 mr-6 mb-6 rounded-r-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="/img/photos/Il Monferrato.jpg"
            alt="Le colline del Monferrato"
          />
        </div>

        <div className="max-w-3xl flex flex-col items-end">
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-12 text-right">
            Il Monferrato
          </h2>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-12 text-justify">
            Una distesa infinita di colline pettinate dai vigneti, dichiarata
            Patrimonio dell'Umanità UNESCO. Il Monferrato è una terra generosa
            che regala eccellenze enogastronomiche uniche al mondo e borghi
            ricchi di storia. Un paesaggio autentico in cui perdersi, dove i
            colori cambiano con le stagioni e regalano tramonti indimenticabili.
          </p>

          <Button
            variant="secondary"
            className="bg-secondary-200 text-secondary-950 px-8 py-6 mx-auto rounded-full text-sm font-medium tracking-wider uppercase hover:bg-secondary-300 transition-colors cursor-pointer shadow-sm h-auto"
          >
            Taste the tradition
          </Button>
        </div>
      </div>

      <section
        id="aperitivo-section"
        className="w-full bg-[#707E54] py-24 px-6 md:px-12 lg:px-24 text-neutral-50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Colonna Testo (Prende 7 colonne su desktop per dare ampio respiro) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Occhiello elegante sopra il titolo */}
            <span className="font-sans text-xs md:text-sm tracking-[0.3em] text-[#E5DCC6] uppercase mb-3 block font-medium">
              Un'esperienza inclusa nel tuo soggiorno
            </span>

            <h2 className="text-4xl md:text-5xl font-serif tracking-[0.15em] uppercase mb-8 leading-tight">
              Aperitivo di Benvenuto
            </h2>

            <p className="text-base md:text-lg text-[#F2EFE9] leading-relaxed font-light mb-10 text-justify max-w-2xl">
              Delizia i tuoi sensi con il nostro esclusivo aperitivo di
              benvenuto offerto dalla casa nel cuore del Monferrato. Un momento
              speciale dove il gusto autentico dei prodotti locali a chilometro
              zero si sposa elegantemente con i vini della regione, inaugurando
              il tuo soggiorno con un'esperienza indimenticabile al tramonto.
            </p>

            {/* Micro-Tiles/Icone: Il dettaglio che arricchisce la sezione */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-8 max-w-xl">
              {/* Calice Barbera */}
              <div className="flex flex-col items-center text-center p-2">
                <HugeiconsIcon
                  icon={BarrelIcon}
                  className="text-[#E5DCC6] mb-2 w-6 h-6"
                  strokeWidth={1.5}
                />

                <span className="text-xs tracking-wider uppercase font-medium text-[#E5DCC6]">
                  Calice Barbera
                </span>
              </div>

              {/* Prodotti Tipici */}
              <div className="flex flex-col items-center text-center p-2">
                <HugeiconsIcon
                  icon={RestaurantIcon}
                  className="text-[#E5DCC6] mb-2 w-6 h-6"
                  strokeWidth={1.5}
                />
                <span className="text-xs tracking-wider uppercase font-medium text-[#E5DCC6]">
                  Prodotti Tipici
                </span>
              </div>

              {/* Vista Vigne */}
              <div className="flex flex-col items-center text-center p-2">
                <HugeiconsIcon
                  icon={TreesIcon}
                  className="text-[#E5DCC6] mb-2 w-6 h-6"
                  strokeWidth={1.5}
                />
                <span className="text-xs tracking-wider uppercase font-medium text-[#E5DCC6]">
                  Vista Vigne
                </span>
              </div>
            </div>
          </div>

          {/* Colonna Foto (Prende 5 colonne su desktop) */}
          <div className="lg:col-span-5 w-full aspect-[4/3] sm:aspect-video lg:aspect-[1.1] overflow-hidden rounded-[4px_60px_4px_60px] shadow-xl">
            <img
              className="w-full h-full object-cover object-center  transform hover:scale-105 transition-transform duration-700 ease-out"
              src="/img/photos/Aperitivo.png"
              alt="Dettaglio del vino versato durante l'aperitivo di benvenuto"
            />
          </div>
        </div>
      </section>

      {/* I Nostri Servizi Section */}
      <section
        id="servizi-section"
        className="w-full bg-[#F2EFE9] py-24 px-6 md:px-12 lg:px-24 text-neutral-950"
      >
        <div className="max-w-7xl mx-auto">
          {/* Titolo Allineato a Sinistra */}
          <div className="mb-16 md:mb-20">
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase text-[#707E54]">
              I Nostri Servizi
            </h2>
          </div>

          {/* Griglia dei Servizi */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 items-center justify-items-center mb-16">
            {/* Servizio 1: Free Wi-Fi */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#707E54] flex items-center justify-center mb-6 text-[#707E54] transition-all duration-300 group-hover:bg-[#707E54] group-hover:text-neutral-50 shadow-sm">
                <HugeiconsIcon
                  icon={WifiIcon}
                  className="w-10 h-10 md:w-12 md:h-12"
                  strokeWidth={1.2}
                />
              </div>
              <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
                Free Wi-Fi
              </span>
            </div>

            {/* Servizio 2: Lavanderia */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#707E54] flex items-center justify-center mb-6 text-[#707E54] transition-all duration-300 group-hover:bg-[#707E54] group-hover:text-neutral-50 shadow-sm">
                <HugeiconsIcon
                  icon={WashingMachineIcon}
                  className="w-10 h-10 md:w-12 md:h-12"
                  strokeWidth={1.2}
                />
              </div>
              <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
                Lavanderia
              </span>
            </div>

            {/* Servizio 3: Parcheggio Interno */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#707E54] flex items-center justify-center mb-6 text-[#707E54] transition-all duration-300 group-hover:bg-[#707E54] group-hover:text-neutral-50 shadow-sm">
                <HugeiconsIcon
                  icon={ParkingAreaCircleIcon}
                  className="w-10 h-10 md:w-12 md:h-12"
                  strokeWidth={1.2}
                />
              </div>
              <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
                Parcheggio Interno
              </span>
            </div>

            {/* Servizio 4: Area Relax */}
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#707E54] flex items-center justify-center mb-6 text-[#707E54] transition-all duration-300 group-hover:bg-[#707E54] group-hover:text-neutral-50 shadow-sm">
                <HugeiconsIcon
                  icon={TerraceIcon}
                  className="w-10 h-10 md:w-12 md:h-12"
                  strokeWidth={1.2}
                />
              </div>
              <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-center text-neutral-800">
                Area Relax
              </span>
            </div>
          </div>

          {/* Bottone "Scopri gli altri servizi" allineato a destra */}
          <div className="w-full flex justify-end mt-12">
            <Button
              variant="secondary"
              className="bg-[#707E54] text-neutral-50 px-8 py-6 rounded-full text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#5b6843] transition-all cursor-pointer shadow-md h-auto"
            >
              Scopri gli altri servizi
            </Button>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section id="mappa-section" className="w-full bg-[#F2EFE9] pt-12">
        <div className="w-full h-[450px] relative shadow-inner overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2817.348633800613!2d8.3228965!3d44.9772095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4787948ef5336e1b%3A0x600ba4974f88e404!2sVia%20della%20Pace%2C%2024%2C%2014030%20Montemagno%20AT!5e0!3m2!1sit!2sit!4v1716750000000!5m2!1sit!2sit"
            className="w-full h-full border-0 grayscale opacity-85 hover:grayscale-0 transition-all duration-700 ease-in-out"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Posizione di Il Respiro del Borgo a Montemagno"
          />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-[#707E54] text-neutral-50 py-16 px-6 md:px-12 lg:px-24 font-light">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Struttura Principale: Informazioni */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left pb-12 border-b border-white/10">
            {/* Colonna Dove Trovarci */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h3 className="font-serif text-xs tracking-[0.25em] uppercase text-[#E5DCC6] font-medium">
                Dove trovarci
              </h3>
              <div className="flex flex-col items-center md:items-start space-y-2 text-sm text-[#F2EFE9] tracking-wide">
                <div className="flex items-center space-x-2">
                  <HugeiconsIcon
                    icon={MapsLocation01Icon}
                    className="w-4 h-4 text-[#E5DCC6]/80"
                    strokeWidth={1.5}
                  />
                  <span>Via della Pace, 24</span>
                </div>
                <p className="pl-6 text-[#E5DCC6]/90 font-medium uppercase text-xs tracking-wider">
                  Montemagno (AT)
                </p>
              </div>
            </div>

            {/* Colonna Contatti */}
            <div className="flex flex-col items-center md:items-end space-y-4">
              <div className="w-full flex flex-col items-center md:items-end space-y-4">
                <h3 className="font-serif text-xs tracking-[0.25em] uppercase text-[#E5DCC6] font-medium">
                  Contatti
                </h3>
                <div className="flex flex-col items-center md:items-end space-y-3 text-sm text-[#F2EFE9] tracking-wide">
                  <a
                    href="tel:+393397096173"
                    className="flex items-center space-x-2 hover:text-[#E5DCC6] transition-colors group"
                  >
                    <HugeiconsIcon
                      icon={CallIcon}
                      className="w-4 h-4 text-[#E5DCC6]/80 group-hover:scale-110 transition-transform"
                      strokeWidth={1.5}
                    />
                    <span>+39 339 7096 173</span>
                  </a>
                  <a
                    href="mailto:ilrespirodelborgobnb@gmail.com"
                    className="flex items-center space-x-2 hover:text-[#E5DCC6] transition-colors group"
                  >
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      className="w-4 h-4 text-[#E5DCC6]/80 group-hover:scale-110 transition-transform"
                      strokeWidth={1.5}
                    />
                    <span>ilrespirodelborgobnb@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sezione Loghi Istituzionali e Social (Bottom Bar) */}
          <div className="w-full pt-10 flex flex-col sm:flex-row items-center justify-between gap-8 text-xs text-[#E5DCC6]/70 tracking-wider">
            {/* Logo B&B Classificazione (Sulla sinistra) */}
            <div className="flex items-center space-x-3 bg-white/5 py-2 px-4 rounded-full border border-white/10">
              <div className="w-7 h-7 bg-emerald-700/20 rounded-full flex items-center justify-center text-emerald-400 font-bold text-[10px] tracking-tighter border border-emerald-500/30">
                ★★
              </div>
              <span className="text-[10px] text-neutral-200 uppercase font-medium">
                Bed & Breakfast
              </span>
            </div>

            {/* Social Link Centrale */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-neutral-100 hover:text-[#E5DCC6] transition-all bg-white/5 hover:bg-white/10 py-2.5 px-5 rounded-full border border-white/10 group"
            >
              <span className="text-xs font-medium uppercase tracking-widest">
                Seguici su
              </span>
              <HugeiconsIcon
                icon={InstagramIcon}
                className="w-4 h-4 transition-transform group-hover:rotate-6"
                strokeWidth={1.5}
              />
            </a>

            {/* Logo Regione Piemonte (Sulla destra) */}
            <div className="flex items-center space-x-3 bg-white/5 py-2 px-4 rounded-full border border-white/10">
              <div className="flex space-x-0.5">
                <span className="w-2 h-3 bg-red-600 block rounded-sm" />
                <span className="w-2 h-3 bg-blue-600 block rounded-sm" />
              </div>
              <span className="text-[10px] uppercase font-semibold text-neutral-300 tracking-widest">
                Regione Piemonte
              </span>
            </div>
          </div>

          {/* Copyright Finale */}
          <div className="mt-12 text-[10px] text-neutral-400/60 tracking-widest text-center uppercase">
            © {new Date().getFullYear()} Il Respiro del Borgo. All rights
            reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
