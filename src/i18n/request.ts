import { getRequestConfig } from "next-intl/server";
import { LANGUAGES } from "@/configuration/language";

export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = LANGUAGES[0].code;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
