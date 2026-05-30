import { Button } from "@/ui/components/shadcn/button";
export function Room() {
  return (
    <section id="room-section" className="w-full py-32 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Contenuto Testuale (6 colonne) */}
        <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
          <span className="font-sans text-xs tracking-[0.3em] text-[#707E54] uppercase mb-3 block font-semibold">
            Il tuo rifugio privato
          </span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-8">
            The Room
          </h2>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-8 text-justify">
            Arredata con pezzi autentici della tradizione contadina e finiture
            curate, la nostra camera offre un comfort raffinato senza tradire lo
            spirito originario della "casa della nonna". Un ambiente intimo e
            silenzioso, pensato per regalare un riposo profondo e rigenerante,
            lontano dal frenetico ritmo quotidiano.
          </p>

          <div className="grid grid-cols-2 gap-4 border-t border-b border-neutral-200 py-6 mb-10 text-xs tracking-wider uppercase text-neutral-600 font-medium">
            <div>• Letto King Size Artigianale</div>
            <div>• Ingresso Indipendente</div>
            <div>• Vista sulle Colline</div>
            <div>• Bagno Privato in Pietra</div>
          </div>

          <div className="flex justify-start">
            <Button
              variant="secondary"
              className="bg-neutral-950 text-white px-8 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm h-auto"
            >
              Scopri il rifugio
            </Button>
          </div>
        </div>

        {/* Immagine con maschera geometrica unificata (6 colonne) */}
        <div
          className={`lg:col-span-6 order-1 lg:order-2 h-125 md:h-150 w-full overflow-hidden shadow-md group rounded-[16px_160px_16px_160px]`}
        >
          <img
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            src="/img/photos/room.jpg"
            alt="Photo of the room"
          />
        </div>
      </div>
    </section>
  );
}
