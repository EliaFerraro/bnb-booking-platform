import { Button } from "@/ui/components/shadcn/button";
export function AboutUs() {
  return (
    <section className="w-full bg-secondary-400 py-16 px-4 md:px-8 lg:px-16 text-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase">
            Chi Siamo
          </h2>
          <div className="h-px w-12 bg-[#a36527] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Foto Sinistra Unificata */}
          <div
            className={`w-full aspect-4/5 overflow-hidden shadow-sm order-1 rounded-[160px_16px_160px_16px]`}
          >
            <img
              src="/img/photos/Lorenzo.jpg"
              alt="L'accoglienza in Monferrato"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Testo Centrale */}
          <div className="flex flex-col items-center text-center px-4 md:px-8 order-3 lg:order-2 py-6 lg:py-0">
            <p className="font-sans text-base md:text-lg leading-relaxed text-gray-700 max-w-md mb-8">
              La mia famiglia ed io vi accogliamo con calore nel nostro rifugio
              storico nel cuore del Monferrato, offrendo un'esperienza autentica
              immersa tra le pievi e le colline, dove la storia, la natura e la
              cultura si fondono armoniosamente.
            </p>

            <Button
              variant="outline"
              className="font-serif uppercase tracking-wider text-sm rounded-full px-6 py-5 h-auto border-neutral-950 text-neutral-950 hover:bg-neutral-950/10 [text-shadow:none]"
            >
              Scopri la nostra storia
            </Button>
          </div>

          {/* Foto Destra Unificata */}
          <div
            className={`w-full aspect-4/5 overflow-hidden shadow-sm order-2 lg:order-3 rounded-[16px_160px_16px_160px]`}
          >
            <img
              src="/img/photos/Margherita.jpg"
              alt="La convivialità nella nostra cascina"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
