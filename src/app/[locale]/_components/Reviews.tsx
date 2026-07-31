import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuoteUpIcon, GoogleIcon } from "@hugeicons/core-free-icons";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Il+Respiro+del+Borgo+Montemagno";

type Review = {
  name: string;
  rating: number;
  text: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill={i < rating ? "#C9A227" : "none"}
          stroke="#C9A227"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  const t = useTranslations("pages.homepage.reviews");
  const reviews = t.raw("items") as Review[];
  return (
    <section
      id="reviews-section"
      className="w-full bg-secondary-50/50 py-16 md:py-24 px-6 md:px-12 lg:px-24 text-neutral-950"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-sans text-xs md:text-sm tracking-[0.3em] text-secondary-600 uppercase mb-3 block font-semibold">
            {t("subtitle")}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-primary-500">
            {t("title")}
          </h2>
          <div className="h-px w-12 bg-secondary-600 mx-auto mt-4 mb-8" />

          <div className="inline-flex items-center gap-3">
            <Stars rating={5} />
            <span className="text-lg font-serif font-semibold text-neutral-950">
              4.9
            </span>
            <span className="h-4 w-px bg-neutral-300" />
            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm text-neutral-600 tracking-wide">
              <HugeiconsIcon icon={GoogleIcon} className="w-4 h-4" strokeWidth={1.5} />
              {t("ratingLabel")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="flex flex-col bg-white border border-secondary-200/70 rounded-2xl shadow-sm p-8"
            >
              <HugeiconsIcon
                icon={QuoteUpIcon}
                className="w-8 h-8 text-secondary-400 mb-4"
                strokeWidth={1.5}
              />

              <Stars rating={review.rating} />

              <p className="mt-4 mb-8 text-base text-neutral-700 leading-relaxed font-light italic flex-grow">
                {review.text}
              </p>

              <div className="flex items-center justify-between border-t border-neutral-100 pt-5">
                <span className="font-serif text-sm tracking-wider uppercase text-neutral-950">
                  {review.name}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-wide uppercase text-neutral-400 font-medium">
                  <HugeiconsIcon icon={GoogleIcon} className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {t("sourceLabel")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center mt-14">
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
            <span className="inline-flex items-center gap-2 bg-primary-500 text-neutral-50 px-8 py-4 rounded-full text-xs font-medium tracking-[0.2em] uppercase hover:bg-primary-700 transition-all cursor-pointer shadow-md">
              <HugeiconsIcon icon={GoogleIcon} className="w-4 h-4" strokeWidth={1.5} />
              {t("cta")}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
