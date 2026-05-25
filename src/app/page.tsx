export default function Home() {
  return (
    <main>
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
        ></img>
      </div>

      <div className="w-full h-40" />

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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac
            lacus id ante posuere feugiat. Sed pulvinar purus ut eleifend
            porttitor. Duis sed feugiat purus, ac efficitur nulla. Ut finibus
            nisl ut nisl hendrerit, id elementum nisl egestas. In convallis
            rhoncus magna, in feugiat lectus efficitur eget. Etiam aliquet, nunc
            a efficitur pellentesque, justo lectus dictum nisi, ut dictum sem
            tortor quis turpis. Vestibulum sit amet dolor sed arcu feugiat
            sodales eget non justo.
          </p>

          <button className="bg-secondary-200 text-secondary-950 px-8 py-3 mx-auto rounded-full text-sm font-medium tracking-wider uppercase hover:bg-secondary-300 transition-colors cursor-pointer shadow-sm">
            Discover the refuge
          </button>
        </div>
      </div>

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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac
            lacus id ante posuere feugiat. Sed pulvinar purus ut eleifend
            porttitor. Duis sed feugiat purus, ac efficitur nulla. Ut finibus
            nisl ut nisl hendrerit, id elementum nisl egestas. In convallis
            rhoncus magna, in feugiat lectus efficitur eget. Etiam aliquet, nunc
            a efficitur pellentesque, justo lectus dictum nisi, ut dictum sem
            tortor quis turpis. Vestibulum sit amet dolor sed arcu feugiat
            sodales eget non justo.
          </p>

          <button className="bg-secondary-200 text-secondary-950 px-8 py-3 mx-auto rounded-full text-sm font-medium tracking-wider uppercase hover:bg-secondary-300 transition-colors cursor-pointer shadow-sm">
            Visit an old house
          </button>
        </div>
      </div>

      <div
        id="aboutus-section"
        className="bg-secondary-400 w-full relative overflow-hidden py-24 md:py-40 px-6 flex flex-col justify-center items-center"
      >
        {/* Griglia Principale Contenitrice */}
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
          {/* LATO SINISTRO: Foto nell'Ovale (es. Mamma) */}
          {/* Su mobile sta sopra il testo, su desktop si allinea a sinistra */}
          <div className="col-span-1 md:col-span-3 flex justify-center md:justify-start order-2 md:order-1 md:pt-24">
            <div className="w-64 h-48 md:w-80 md:h-60 bg-neutral-200 shadow-xl border-4 border-amber-900/10 transition-transform hover:scale-105 duration-300 [clip-path:ellipse(50%_50%_at_50%_50%)]">
              <img
                src="/path-to-mamma-image.jpg"
                alt="Accoglienza"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* CENTRO: Testo e Titolo */}
          <div className="col-span-1 md:col-span-6 flex flex-col items-center text-center order-1 md:order-2 px-4">
            <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-8 md:mb-12">
              About us
            </h2>
            <p className="text-base md:text-lg text-neutral-950 leading-relaxed font-light max-w-xl">
              La mia famiglia e io accogliamo con calore nel nostro rifugio
              storico nel cuore del Monferrato, offrendo un'esperienza autentica
              immersa tra le pievi e le colline, dove la storia, la natura e la
              cultura si fondono armoniosamente.
            </p>
          </div>

          {/* LATO DESTRO: Foto ad Arco / Finestra (es. Papà col Sax) */}
          {/* Su mobile va sotto, su desktop si allinea a destra e svetta verso l'alto */}
          <div className="col-span-1 md:col-span-3 flex justify-center md:justify-end order-3 md:pb-12">
            <div className="w-64 h-96 md:w-72 md:h-[450px] bg-neutral-200 shadow-xl border-4 border-amber-900/10 transition-transform hover:scale-105 duration-300 [clip-path:path('M_0,288_A_144,144_0_0,1_288,288_L_288,576_L_0,576_Z')] md:[clip-path:path('M_0,144_A_144,144_0_0,1_288,144_L_288,576_L_0,576_Z')]">
              {/* Nota sui clip-path complessi: Se preferisci una gestione standard senza path SVG inline, 
                puoi usare la classe Tailwind 'rounded-t-full' che simula perfettamente l'arco superiore! */}
              <img
                src="/path-to-sax-image.jpg"
                alt="Il nostro rifugio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sfondo Decorativo Soft (Opzionale: per dare profondità come nel mockup) */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/5 pointer-events-none z-0" />
      </div>
    </main>
  );
}
