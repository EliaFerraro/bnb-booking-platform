import { HugeiconsIcon } from "@hugeicons/react";
import {
  CoffeeIcon,
  CheeseCake01Icon,
  NaturalFoodIcon,
} from "@hugeicons/core-free-icons";
export function Breakfast() {
  return (
    <section
      id="breakfast-section"
      className="w-full bg-[#707E54] py-24 px-6 md:px-12 lg:px-24 text-neutral-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Colonna Testo (7 colonne) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <span className="font-sans text-xs md:text-sm tracking-[0.3em] text-[#E5DCC6] uppercase mb-3 block font-medium">
            Il buongiorno ha un sapore autentico
          </span>

          <h2 className="text-4xl md:text-5xl font-serif tracking-[0.15em] uppercase mb-8 leading-tight">
            La Colazione in Giardino
          </h2>

          <p className="text-base md:text-lg text-[#F2EFE9] leading-relaxed font-light mb-10 text-justify max-w-2xl">
            Inizia la tua giornata immerso nel verde del nostro parco, dove il
            profumo del caffè si fonde con l'aria fresca del mattino. La nostra
            colazione celebra il territorio con una selezione accurata di torte
            e crostate fatte in casa, pane artigianale, frutta fresca di
            stagione e delizie locali a chilometro zero, pensate per regalarti
            un risveglio dolce e rigenerante.
          </p>

          <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-8 max-w-xl">
            <div className="flex flex-col items-center text-center p-2">
              <HugeiconsIcon
                icon={CoffeeIcon}
                className="text-[#E5DCC6] mb-2 w-6 h-6"
                strokeWidth={1.5}
              />
              <span className="text-xs tracking-wider uppercase font-medium text-[#E5DCC6]">
                Caffetteria Express
              </span>
            </div>

            <div className="flex flex-col items-center text-center p-2">
              <HugeiconsIcon
                icon={CheeseCake01Icon}
                className="text-[#E5DCC6] mb-2 w-6 h-6"
                strokeWidth={1.5}
              />
              <span className="text-xs tracking-wider uppercase font-medium text-[#E5DCC6]">
                Dolci Artigianali
              </span>
            </div>

            <div className="flex flex-col items-center text-center p-2">
              <HugeiconsIcon
                icon={NaturalFoodIcon}
                className="text-[#E5DCC6] mb-2 w-6 h-6"
                strokeWidth={1.5}
              />
              <span className="text-xs tracking-wider uppercase font-medium text-[#E5DCC6]">
                Km Zero & Natura
              </span>
            </div>
          </div>
        </div>

        {/* Colonna Foto geometricamente unificata (5 colonne) */}
        <div
          className={`lg:col-span-5 w-full aspect-4/3 sm:aspect-video lg:aspect-[1.1] overflow-hidden shadow-xl rounded-[16px_160px_16px_160px]`}
        >
          <img
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
            src="/img/photos/Casa con colazione.jpg"
            alt="Tavola imbandita per la colazione all'aperto nel giardino del B&B"
          />
        </div>
      </div>
    </section>
  );
}
