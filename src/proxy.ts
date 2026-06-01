// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LANGUAGES, DEFAULT_LANGUAGE } from "@/configuration/language";

// Uniformiamo in lowercase per evitare mismatch (es. "it" vs "IT")
const SUPPORTED_LOCALES = LANGUAGES.map((l) => l.code.toLowerCase());
const DEFAULT_LOCALE = DEFAULT_LANGUAGE.code.toLowerCase();

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Lascia passare file statici e API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Controlla se l'URL ha già il prefisso della lingua valido
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return NextResponse.next();

  // 3. Recupera la lingua dai cookie
  let locale = request.cookies.get("NEXT_LOCALE")?.value?.toLowerCase();

  // 4. Fallback: lingua del browser (se supportata) o default
  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const browserLang = acceptLanguage
      .split(",")[0]
      .split("-")[0]
      .toLowerCase();

    locale = SUPPORTED_LOCALES.includes(browserLang)
      ? browserLang
      : DEFAULT_LOCALE;
  }

  // 5. Esegui il redirect nativo verso la rotta localizzata
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);

  const response = NextResponse.redirect(redirectUrl);
  // Settiamo il cookie per i passaggi futuri se non era presente
  response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
