import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { LANGUAGES, DEFAULT_LANGUAGE } from "@/configuration/language";

const SUPPORTED_LOCALES = LANGUAGES.map((l) => l.code.toLowerCase());
const DEFAULT_LOCALE = DEFAULT_LANGUAGE.code.toLowerCase();

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale viene popolato da setRequestLocale() nel layout/page.
  const requested = await requestLocale;
  const locale = hasLocale(SUPPORTED_LOCALES, requested)
    ? requested
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
