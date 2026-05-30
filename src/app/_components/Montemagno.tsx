import { Button } from "@/ui/components/shadcn/button";
export function Montemagno() {
  return (
    <section id="montemagno-section" className="w-full py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Contenuto Testuale (6 colonne) */}
        <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
          <span className="font-sans text-xs tracking-[0.3em] text-[#707E54] uppercase mb-3 block font-semibold">
            Il borgo a mandorla
          </span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-8">
            Montemagno
          </h2>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-8 text-justify">
            Arroccato sulla collina, Montemagno è un borgo medievale unico nel
            suo genere, celebre per il suo caratteristico impianto urbano a
            mandorla e i suoi dodici vicoli storici. Passeggiare tra le sue
            strade significa fare un salto indietro nel tempo, ammirando
            l'imponente castello merlato che domina silenzioso la vallata
            circostante.
          </p>

          <div className="flex items-center space-x-6 text-xs tracking-wider uppercase text-neutral-500 font-medium mb-10">
            <div className="flex flex-col">
              <span className="text-xl font-serif text-neutral-950 font-semibold mb-1">
                12
              </span>
              <span>Vicoli Storici</span>
            </div>
            <div className="h-8 w-px bg-neutral-300" />
            <div className="flex flex-col">
              <span className="text-xl font-serif text-neutral-950 font-semibold mb-1">
                XIX s.
              </span>
              <span>Piazza Barocca</span>
            </div>
            <div className="h-8 w-px bg-neutral-300" />
            <div className="flex flex-col">
              <span className="text-xl font-serif text-neutral-950 font-semibold mb-1">
                A piedi
              </span>
              <span>Dal B&B</span>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              variant="secondary"
              className="bg-neutral-900 text-white px-8 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer h-auto"
            >
              Esplora il borgo medievale
            </Button>
          </div>
        </div>

        {/* Immagine geometricamente unificata (6 colonne) */}
        <div
          className={`lg:col-span-6 order-1 lg:order-2 h-125 md:h-150 w-full overflow-hidden shadow-lg group rounded-[16px_160px_16px_160px]`}
        >
          <img
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            src="/img/photos/Montemagno.jpeg"
            alt="Il borgo di Montemagno"
          />
        </div>
      </div>
    </section>
  );
}
