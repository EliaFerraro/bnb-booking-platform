import { useTranslations } from "next-intl";

export function Map() {
  const t = useTranslations("pages.homepage.map");
  return (
    <section id="mappa-section" className="w-full bg-secondary-50 pt-12">
      <div className="w-full h-112.5 relative shadow-inner overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2378.3064615128733!2d8.32918422280645!3d44.97954837222017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47879796d9f3d325%3A0xb81fd54187ec5bf1!2sB%26B%20Il%20respiro%20del%20borgo%2C%20CODICE%20CIN%20IT005077C1SCRVTNU4!5e1!3m2!1sit!2sit!4v1782767467060!5m2!1sit!2sit"
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
