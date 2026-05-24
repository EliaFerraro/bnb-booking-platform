"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/components/shadcn/dropdown-menu";
import { Button } from "@/ui/components/shadcn/button";
import { IT, GB, DE } from "country-flag-icons/react/3x2";

const LANGUAGES = [
  { code: "IT", label: "IT", Flag: IT },
  { code: "EN", label: "EN", Flag: GB },
  { code: "DE", label: "DE", Flag: DE },
];

export function LanguagePicker() {
  const [currentLang, setLanguage] = useState("EN");
  const router = useRouter();

  const handleLangChange = (lang: string) => {
    setLanguage(lang);
    router.refresh();
  };

  // Troviamo la bandiera corrente per il trigger della Navbar
  const CurrentFlag = LANGUAGES.find((l) => l.code === currentLang)?.Flag || GB;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 text-neutral-50 hover:text-primary-200 transition-colors uppercase tracking-wider font-medium text-sm focus-visible:ring-0"
        >
          <CurrentFlag className="w-5 h-auto rounded-sm object-cover" />
          <span>{currentLang}</span>
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
            {/* La bandiera iniettata come SVG inline, stilizzabile al volo con Tailwind */}
            <Flag className="w-50 h-auto rounded-sm object-cover" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
