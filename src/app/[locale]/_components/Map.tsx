import { useTranslations } from "next-intl";
import { GOOGLE_MAPS_EMBED_URL } from "@/configuration/contact";

/** Rendered by the locale layout, so it appears above the footer on every page. */
export function Map() {
  const t = useTranslations("map");
  return (
    // Nessun padding: la mappa è a tutta larghezza e attaccata alla sezione
    // precedente, altrimenti bg-secondary-50 lascia una banda chiara visibile
    // sopra l'iframe (evidente sotto la fascia primary della pagina contatti).
    <section id="mappa-section" className="w-full bg-secondary-50">
      <div className="w-full h-80 md:h-112.5 relative shadow-inner overflow-hidden">
        <iframe
          src={GOOGLE_MAPS_EMBED_URL}
          className="w-full h-full border-0 grayscale opacity-85 hover:grayscale-0 transition-all duration-700 ease-in-out"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={t("title")}
        />
      </div>
    </section>
  );
}
