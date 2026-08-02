"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { EMAIL } from "@/configuration/contact";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/shadcn/dialog";

const POINT_KEYS = [
  "language",
  "enquiry",
  "enquiryBasis",
  "retention",
  "rights",
] as const;

export function LegalPolicyModal({ className }: { className?: string }) {
  const t = useTranslations("footer.legal");

  const triggerClass =
    "hover:text-neutral-50 transition-colors focus-visible:outline-none focus-visible:text-neutral-50 focus-visible:underline underline-offset-4 cursor-pointer uppercase";

  return (
    <Dialog>
      <DialogTrigger className={cn(triggerClass, className)}>
        {t("privacy")}
      </DialogTrigger>

      <DialogContent closeLabel={t("policy.close")}>
        <DialogHeader>
          <DialogTitle className="font-serif text-lg tracking-wide text-foreground normal-case">
            {t("policy.title")}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed normal-case tracking-normal">
            {t("policy.intro")}
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80 normal-case tracking-normal">
          {POINT_KEYS.map((key) => (
            <li key={key} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-400"
              />
              <span>{t(`policy.points.${key}`, { email: EMAIL })}</span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
