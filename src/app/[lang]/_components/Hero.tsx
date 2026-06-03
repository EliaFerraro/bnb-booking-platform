export function Hero() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden">
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
        className="absolute top-0 left-0 z-0 object-cover w-full h-full"
        src="/img/photos/sunset_yard.jpg"
        alt="Sunset yard"
      />
    </div>
  );
}
