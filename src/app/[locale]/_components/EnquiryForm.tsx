"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/ui/components/shadcn/button";
import { LegalPolicyModal } from "@/ui/components/custom/LegalPolicyModal";
import { mailtoHref, whatsappHref } from "@/configuration/contact";
import { submitEnquiry } from "@/lib/enquiry/actions";
import { initialEnquiryState } from "@/lib/enquiry/state";
import type { EnquiryInput } from "@/lib/enquiry/schema";
import { cn } from "@/lib/utils";

type EnquiryField = keyof EnquiryInput;

const FIELD_CLASS =
  "w-full rounded-[8px] border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-950 transition-colors placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25 aria-[invalid=true]:border-red-600";

const LABEL_CLASS =
  "block text-[11px] tracking-[0.2em] uppercase text-neutral-600 font-semibold mb-2";

export function EnquiryForm() {
  const t = useTranslations("pages.contact.form");
  const tc = useTranslations("contactChannels");
  const locale = useLocale();
  const pathname = usePathname();

  const [state, formAction, isPending] = useActionState(
    submitEnquiry,
    initialEnquiryState
  );

  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const arrivalRef = useRef<HTMLInputElement>(null);
  const departureRef = useRef<HTMLInputElement>(null);
  const baseId = useId();

  // Stamped after mount so the server renders no time-dependent value, which
  // would otherwise produce a hydration mismatch.
  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now());
    }
    const today = new Date().toISOString().slice(0, 10);
    arrivalRef.current?.setAttribute("min", today);
    departureRef.current?.setAttribute("min", today);
  }, []);

  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  // Move focus to the first rejected field so keyboard and screen-reader users
  // are not left at the bottom of the form guessing what failed.
  useEffect(() => {
    if (!fieldErrors) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [fieldErrors]);

  if (state.status === "success") {
    return (
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-primary-500 text-neutral-50 flex items-center justify-center mb-6">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="w-8 h-8"
            strokeWidth={1.5}
          />
        </div>
        <h3 className="font-serif text-2xl md:text-3xl tracking-wider uppercase text-neutral-950 mb-4">
          {t("success.title")}
        </h3>
        <p className="text-base text-neutral-700 leading-relaxed font-light mb-2">
          {t("success.body", { email: state.email })}
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed font-light mb-8">
          {t("success.spamHint")}
        </p>
        <Button
          asChild
          className="bg-primary-500 text-neutral-50 px-8 py-5 rounded-full text-xs font-semibold tracking-widest uppercase h-auto hover:bg-primary-600"
        >
          <a
            href={whatsappHref(tc("whatsappPrefill"))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <HugeiconsIcon icon={WhatsappIcon} className="w-4 h-4" strokeWidth={1.5} />
            {t("success.faster")}
          </a>
        </Button>
      </div>
    );
  }

  const errorFor = (field: EnquiryField) => fieldErrors?.[field];

  const describedBy = (field: EnquiryField) =>
    errorFor(field) ? `${baseId}-${field}-error` : undefined;

  // A plain render function rather than a nested component, so React does not
  // remount the node on every parent render.
  const fieldError = (field: EnquiryField) => {
    const code = errorFor(field);
    if (!code) return null;
    return (
      <p
        id={`${baseId}-${field}-error`}
        className="mt-2 flex items-start gap-1.5 text-xs text-red-700"
      >
        <HugeiconsIcon
          icon={Alert02Icon}
          className="w-3.5 h-3.5 mt-px shrink-0"
          strokeWidth={2}
        />
        <span>{t(`errors.${code}`)}</span>
      </p>
    );
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="max-w-3xl mx-auto"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="sourcePath" value={pathname} />
      <input type="hidden" name="startedAt" defaultValue="0" ref={startedAtRef} />

      {/* Honeypot: hidden from users and assistive tech, irresistible to bots.
          Positioned off-screen rather than display:none, which bots detect. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px" }}
        className="w-px h-px overflow-hidden"
      >
        <label htmlFor={`${baseId}-website`}>Website</label>
        <input
          id={`${baseId}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div className="sm:col-span-1">
          <label htmlFor={`${baseId}-name`} className={LABEL_CLASS}>
            {t("fields.name")} *
          </label>
          <input
            id={`${baseId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            className={FIELD_CLASS}
            aria-invalid={Boolean(errorFor("name"))}
            aria-describedby={describedBy("name")}
          />
          {fieldError("name")}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor={`${baseId}-email`} className={LABEL_CLASS}>
            {t("fields.email")} *
          </label>
          <input
            id={`${baseId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            className={FIELD_CLASS}
            aria-invalid={Boolean(errorFor("email"))}
            aria-describedby={describedBy("email")}
          />
          {fieldError("email")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${baseId}-phone`} className={LABEL_CLASS}>
            {t("fields.phone")}
          </label>
          <input
            id={`${baseId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            className={FIELD_CLASS}
            aria-invalid={Boolean(errorFor("phone"))}
            aria-describedby={describedBy("phone")}
          />
          {fieldError("phone")}
        </div>

        <div>
          <label htmlFor={`${baseId}-arrival`} className={LABEL_CLASS}>
            {t("fields.arrival")}
          </label>
          <input
            id={`${baseId}-arrival`}
            ref={arrivalRef}
            name="arrival"
            type="date"
            className={FIELD_CLASS}
            aria-invalid={Boolean(errorFor("arrival"))}
            aria-describedby={describedBy("arrival")}
          />
          {fieldError("arrival")}
        </div>

        <div>
          <label htmlFor={`${baseId}-departure`} className={LABEL_CLASS}>
            {t("fields.departure")}
          </label>
          <input
            id={`${baseId}-departure`}
            ref={departureRef}
            name="departure"
            type="date"
            className={FIELD_CLASS}
            aria-invalid={Boolean(errorFor("departure"))}
            aria-describedby={describedBy("departure")}
          />
          {fieldError("departure")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${baseId}-guests`} className={LABEL_CLASS}>
            {t("fields.guests")}
          </label>
          <input
            id={`${baseId}-guests`}
            name="guests"
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            className={cn(FIELD_CLASS, "sm:max-w-40")}
            aria-invalid={Boolean(errorFor("guests"))}
            aria-describedby={describedBy("guests")}
          />
          {fieldError("guests")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${baseId}-message`} className={LABEL_CLASS}>
            {t("fields.message")} *
          </label>
          <textarea
            id={`${baseId}-message`}
            name="message"
            rows={6}
            required
            placeholder={t("fields.messagePlaceholder")}
            className={cn(FIELD_CLASS, "resize-y")}
            aria-invalid={Boolean(errorFor("message"))}
            aria-describedby={describedBy("message")}
          />
          {fieldError("message")}
        </div>
      </div>

      {/* Result announcements for assistive tech; also the visible error block. */}
      <div aria-live="polite" className="mt-6">
        {state.status === "error" && state.formError && (
          <div className="rounded-[8px] border border-red-300 bg-red-50 p-5 text-sm text-red-900">
            <p className="flex items-start gap-2 font-medium">
              <HugeiconsIcon
                icon={Alert02Icon}
                className="w-4 h-4 mt-0.5 shrink-0"
                strokeWidth={2}
              />
              <span>{t(`errors.${state.formError}`)}</span>
            </p>
            <p className="mt-3 text-red-800/90">
              {t("errors.fallbackIntro")}{" "}
              <a
                href={whatsappHref(tc("whatsappPrefill"))}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 font-medium"
              >
                WhatsApp
              </a>{" "}
              <span aria-hidden="true">·</span>{" "}
              <a
                href={mailtoHref(tc("mailSubject"), tc("mailBody"))}
                className="underline underline-offset-4 font-medium"
              >
                {t("errors.fallbackEmail")}
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary-500 text-neutral-50 px-10 py-6 rounded-full text-xs font-semibold tracking-widest uppercase h-auto hover:bg-primary-600 disabled:opacity-60 shadow-md"
        >
          {isPending ? t("submitting") : t("submit")}
        </Button>

        <p className="text-xs text-neutral-500 leading-relaxed font-light">
          {t("privacyNote")}{" "}
          <LegalPolicyModal className="normal-case underline underline-offset-4 text-neutral-600 hover:text-neutral-900" />
        </p>
      </div>

      <p className="mt-4 text-xs text-neutral-500">{t("requiredNote")}</p>
    </form>
  );
}

export default EnquiryForm;
