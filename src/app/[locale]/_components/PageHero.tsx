import Image from "next/image";

interface Props {
  image: string;
  alt: string;
  subtitle: string;
  title: string;
  tagline: string;
  /** Tailwind text-color class for the small uppercase subtitle (default sand). */
  accentClassName?: string;
}

export function PageHero({
  image,
  alt,
  subtitle,
  title,
  tagline,
  accentClassName = "text-secondary-200",
}: Props) {
  return (
    <section className="relative w-full h-[62vh] min-h-[440px] flex items-center justify-center overflow-hidden">
      {/* Above the fold on every subpage, so it is fetched eagerly. */}
      <Image
        className="z-0 object-cover"
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-neutral-950/50 via-neutral-950/30 to-neutral-950/60" />

      <div className="relative z-20 text-center text-neutral-50 px-6 max-w-3xl">
        <span
          className={`font-sans text-xs md:text-sm tracking-[0.35em] uppercase font-semibold block mb-5 ${accentClassName}`}
        >
          {subtitle}
        </span>
        <h1 className="font-serif text-5xl md:text-7xl tracking-widest uppercase mb-6">
          {title}
        </h1>
        <div className="h-px w-16 bg-secondary-200/70 mx-auto mb-6" />
        <p className="font-serif italic text-lg md:text-2xl text-secondary-50/90 tracking-wide font-light">
          {tagline}
        </p>
      </div>
    </section>
  );
}
