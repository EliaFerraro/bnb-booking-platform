export default function Home() {
  return (
    <main>
      <div
        id="hero-section"
        className="h-screen flex flex-col justify-center items-center relative"
      >
        <div className="z-10 text-neutral-50 relative top-20">
          <h1 className="text-center text-7xl">IL RESPIRO DEL BORGO</h1>
          <div className="flex flex-col items-center text-2xl mt-40 tracking-widest">
            <span>FAMIGLIA, NATURA E OSPITALITA'</span>
            <span>IL TUO B&B IMMERSO NEL VERDE</span>
          </div>
        </div>

        <img
          className="absolute top-0 left-0 w-full h-full z-0"
          src="/img/photos/sunset_yard.jpg"
        ></img>
      </div>
    </main>
  );
}
