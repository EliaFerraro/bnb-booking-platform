"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/components/shadcn/dropdown-menu";
import { Button } from "@/ui/components/shadcn/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Globe02FreeIcons } from "@hugeicons/core-free-icons";

export function LanguagePicker() {
  const [currentLang, setCurrentLang] = useState("EN");

  return (
    <DropdownMenu>
      {/* Il Trigger: un bottone minimale, senza sfondi pesanti */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 text-neutral-50 hover:text-primary-200 transition-colors uppercase tracking-wider font-medium text-sm focus-visible:ring-0"
        >
          <HugeiconsIcon
            icon={Globe02FreeIcons}
            size={16} // Equivale a w-4 h-4
            color="currentColor"
            strokeWidth={1.5}
          />
          <span>{currentLang}</span>
        </Button>
      </DropdownMenuTrigger>

      {/* La tendina fluttuante: stilizzata con i tuoi token di Figma */}
      <DropdownMenuContent
        align="end"
        className="bg-background border border-border rounded-md shadow-lg min-w-20 p-1 animate-in fade-in-50 duration-200"
      >
        <DropdownMenuItem
          onClick={() => setCurrentLang("IT")}
          className="flex items-center justify-center px-3 py-2 text-sm text-foreground hover:bg-secondary-100 hover:text-secondary-800 rounded-sm cursor-pointer transition-colors uppercase font-medium"
        >
          IT
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setCurrentLang("EN")}
          className="flex items-center justify-center px-3 py-2 text-sm text-foreground hover:bg-secondary-100 hover:text-secondary-800 rounded-sm cursor-pointer transition-colors uppercase font-medium"
        >
          EN
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setCurrentLang("DE")}
          className="flex items-center justify-center px-3 py-2 text-sm text-foreground hover:bg-secondary-100 hover:text-secondary-800 rounded-sm cursor-pointer transition-colors uppercase font-medium"
        >
          DE
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
