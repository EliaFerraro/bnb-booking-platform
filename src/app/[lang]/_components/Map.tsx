export function Map() {
  return (
    <section id="mappa-section" className="w-full bg-[#F2EFE9] pt-12">
      <div className="w-full h-112.5 relative shadow-inner overflow-hidden">
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
  );
}
