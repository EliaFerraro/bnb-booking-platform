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
      <div id="room-section" className="w-full py-6 pl-6 overflow-hidden">
        <div className="float-right w-full md:w-1/2 h-87 md:h-125 ml-6 mb-6 rounded-l-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="/img/photos/room.jpg"
            alt="La Camera del Borgo"
          />
        </div>

        {/* 2. IL CONTENUTO TESTUALE (Scorre e reagisce alla forma dell'immagine) */}
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-neutral-950 uppercase mb-12">
            La Camera
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

          {/* Il bottone custom di Shadcn stilizzato con la tua palette */}
          <button className="bg-secondary-200 text-secondary-950 px-8 py-3 rounded-full text-sm font-medium tracking-wider uppercase hover:bg-secondary-300 transition-colors cursor-pointer shadow-sm">
            Scopri il tuo rifugio
          </button>
        </div>
      </div>
    </main>
  );
}
