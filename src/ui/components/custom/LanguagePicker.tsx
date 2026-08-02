"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/components/shadcn/dropdown-menu";
import { Button } from "@/ui/components/shadcn/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { LANGUAGES, DEFAULT_LANGUAGE } from "@/configuration/language";

const STORAGE_KEY = "user-preferred-language";
const COOKIE_KEY = "NEXT_LOCALE";

// Helper per impostare sia Cookie che LocalStorage
const saveLanguagePreference = (lang: string) => {
  const lowerLang = lang.toLowerCase();
  localStorage.setItem(STORAGE_KEY, lowerLang);
  // Imposta il cookie valido per tutto il dominio
  document.cookie = `${COOKIE_KEY}=${lowerLang}; path=/; max-age=31536000; SameSite=Lax`;
};

export function LanguagePicker() {
  const router = useRouter();
  const pathname = usePathname();

  // La lingua attiva è già risolta da proxy.ts (cookie -> accept-language ->
  // default) e messa a disposizione da NextIntlClientProvider: non serve
  // duplicarla in uno stato locale né ricavarla dall'URL.
  const currentLang = useLocale().toLowerCase();

  // Unico effetto rimasto: allineare gli storage del browser alla lingua
  // mostrata, così la preferenza sopravvive alla visita successiva.
  useEffect(() => {
    saveLanguagePreference(currentLang);
  }, [currentLang]);

  const handleLangChange = (newLang: string) => {
    const lowerNewLang = newLang.toLowerCase();

    saveLanguagePreference(lowerNewLang);

    // Calcola la nuova rotta sostituendo il primo segmento dell'URL
    const segments = pathname.split("/");
    const currentUrlLocale = segments[1]?.toLowerCase();
    const hasLocaleSegment = LANGUAGES.some(
      (l) => l.code.toLowerCase() === currentUrlLocale,
    );

    if (hasLocaleSegment) {
      segments[1] = lowerNewLang; // Sostituisce ad es. /it/dashboard con /en/dashboard
    } else {
      segments.unshift(lowerNewLang); // Sicurezza se la rotta non fosse intercettata
    }

    const newPathname = segments.join("/");
    router.push(newPathname);
  };

  const CurrentFlag =
    LANGUAGES.find((l) => l.code.toLowerCase() === currentLang)?.Flag ||
    DEFAULT_LANGUAGE.Flag;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2 px-2 py-1 text-neutral-50 hover:bg-primary-400 transition-colors uppercase tracking-wider font-medium text-sm focus-visible:ring-0 cursor-pointer">
          <CurrentFlag className="w-5 h-auto rounded-sm object-cover" />
          <span>{currentLang}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-background border border-border rounded-md shadow-lg min-w-28 p-1 animate-in fade-in-50 duration-200"
      >
        {LANGUAGES.map(({ code, label, Flag }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLangChange(code)}
            className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary-100 hover:text-secondary-800 rounded-sm cursor-pointer transition-colors uppercase font-medium"
          >
            <span className="tracking-wider">{label}</span>
            <Flag className="w-5 h-auto rounded-sm object-cover" />
          </DropdownMenuItem>
        )).sort((a, b) => a.key?.localeCompare(b.key ?? "") ?? 0)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
