import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LANGUAGES, DEFAULT_LANGUAGE } from "@/configuration/language";
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  SITE_URL,
  STRUCTURE_NAME,
} from "@/configuration/site";
import { RESPONSE_HOURS } from "@/configuration/stay";

const LOCALES = LANGUAGES.map((l) => l.code.toLowerCase());
const DEFAULT_LOCALE = DEFAULT_LANGUAGE.code.toLowerCase();

/**
 * Open Graph wants a full territory tag (`it_IT`), unlike hreflang, which is
 * happy with the bare language. Facebook drops the property entirely when the
 * value is not one of the tags it recognises.
 */
const OG_LOCALE: Record<string, string> = {
  it: "it_IT",
  en: "en_GB",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
};

/** The message key under `meta` holding a subpage's title and description. */
export type MetaPage =
  | "structure"
  | "environment"
  | "services"
  | "contact"
  | "privacy"
  | "cookiePolicy"
  | "terms";

interface Options {
  locale: string;
  /** Omitted on the homepage, which uses the site-wide title and description. */
  page?: MetaPage;
}

/**
 * The path a page occupies under every locale, used to build the canonical URL
 * and the hreflang set. Kept next to the metadata rather than derived from the
 * route so that both stay in one place when a page is added.
 */
const PATHS: Record<MetaPage | "home", string> = {
  home: "",
  structure: "/structure",
  environment: "/environment",
  services: "/services",
  contact: "/contact",
  privacy: "/privacy",
  cookiePolicy: "/cookie-policy",
  terms: "/terms",
};

export async function buildMetadata({
  locale,
  page,
}: Options): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });

  // Every meta string gets the same values. Which of them a given message
  // actually interpolates is the translator's business, and ICU ignores the
  // rest — that beats keeping a per-key list of who needs what in sync.
  const facts = { brand: STRUCTURE_NAME, hours: RESPONSE_HOURS };

  const path = PATHS[page ?? "home"];
  const title = page
    ? t(`${page}.title`, facts)
    : `${STRUCTURE_NAME} — ${t("tagline", facts)}`;
  const description = page
    ? t(`${page}.description`, facts)
    : t("description", facts);

  // Titles for subpages arrive bare and are completed by the layout's template;
  // Open Graph has no template of its own, so it gets the finished string.
  const socialTitle = page ? `${title} · ${STRUCTURE_NAME}` : title;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}${path}`])),
        // Tells a crawler which version to show a visitor whose language we do
        // not publish. Without it Google picks one for us.
        "x-default": `/${DEFAULT_LOCALE}${path}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: STRUCTURE_NAME,
      title: socialTitle,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      locale: OG_LOCALE[locale] ?? OG_LOCALE[DEFAULT_LOCALE],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => OG_LOCALE[l]
      ),
      images: [
        {
          url: OG_IMAGE_PATH,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: t("ogAlt", facts),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}
