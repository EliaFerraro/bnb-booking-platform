"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  UserMultiple02Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/ui/components/shadcn/button";
import { TextField } from "@/ui/components/form/TextField";
import { TextareaField } from "@/ui/components/form/TextareaField";
import { LegalPolicyModal } from "@/ui/components/custom/LegalPolicyModal";
import { mailtoHref, whatsappHref } from "@/configuration/contact";
import { submitEnquiry } from "@/lib/enquiry/actions";
import { initialEnquiryState } from "@/lib/enquiry/state";
import { enquirySchema, firstIssuePerField } from "@/lib/enquiry/schema";

const EMPTY_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  arrival: "",
  departure: "",
  guests: "",
  message: "",
};

type FieldName = keyof typeof EMPTY_VALUES;

const FIELD_NAMES = Object.keys(EMPTY_VALUES) as FieldName[];

export function EnquiryForm() {
  const t = useTranslations("pages.contact.form");
  const tc = useTranslations("contactChannels");
  const locale = useLocale();
  const pathname = usePathname();

  const [state, formAction, isPending] = useActionState(
    submitEnquiry,
    initialEnquiryState
  );

  const [values, setValues] = useState(EMPTY_VALUES);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitAttempt, setSubmitAttempt] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const arrivalRef = useRef<HTMLInputElement>(null);
  const departureRef = useRef<HTMLInputElement>(null);

  // Stamped after mount so the server renders no time-dependent value, which
  // would otherwise produce a hydration mismatch. Same reason for the date
  // minimums: "today" is not knowable at render time on the server.
  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now());
    }
    const today = new Date().toISOString().slice(0, 10);
    arrivalRef.current?.setAttribute("min", today);
    departureRef.current?.setAttribute("min", today);
  }, []);

  // The same schema the server uses, so a field can never be accepted here and
  // rejected there. Cross-field rules work because the whole object is parsed;
  // only the display is filtered by which fields have been touched.
  const clientErrors = useMemo(() => {
    const result = enquirySchema.safeParse({
      ...values,
      locale,
      sourcePath: pathname,
    });
    return result.success ? {} : firstIssuePerField(result.error);
  }, [values, locale, pathname]);

  const serverErrors = state.status === "error" ? state.fieldErrors : undefined;

  /** Live validation once a field has been left; server errors until then. */
  const errorFor = (field: FieldName) => {
    const key = touched[field] ? clientErrors[field] : serverErrors?.[field];
    return key ? t(`errors.${key}`) : undefined;
  };

  const handleChange = (field: FieldName) => (value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  const markTouched = (...fields: FieldName[]) =>
    setTouched((previous) => {
      const next = { ...previous };
      for (const field of fields) next[field] = true;
      return next;
    });

  const fieldProps = (field: FieldName) => ({
    name: field,
    value: values[field],
    error: errorFor(field),
    onChange: (event: { target: { value: string } }) =>
      handleChange(field)(event.target.value),
    // Blurring either date also reveals the other's error: the "departure
    // needs an arrival" rule is reported on a field the guest never touched.
    onBlur: () =>
      field === "arrival" || field === "departure"
        ? markTouched("arrival", "departure")
        : markTouched(field),
  });

  const hasClientErrors = Object.keys(clientErrors).length > 0;

  // Focus the first rejected control after a blocked submit or a server
  // rejection, so keyboard and screen-reader users are not left guessing.
  useEffect(() => {
    if (submitAttempt === 0 && !serverErrors) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [submitAttempt, serverErrors]);

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

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      onSubmit={(event) => {
        // Without JavaScript this never runs and the server validates instead.
        if (hasClientErrors) {
          event.preventDefault();
          markTouched(...FIELD_NAMES);
          setSubmitAttempt((attempt) => attempt + 1);
        }
      }}
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
        <label htmlFor="enquiry-website">Website</label>
        <input
          id="enquiry-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-5">
        <TextField
          {...fieldProps("firstName")}
          className="sm:col-span-3"
          label={t("fields.firstName")}
          type="text"
          autoComplete="given-name"
          required
        />

        <TextField
          {...fieldProps("lastName")}
          className="sm:col-span-3"
          label={t("fields.lastName")}
          type="text"
          autoComplete="family-name"
          required
        />

        <TextField
          {...fieldProps("email")}
          className="sm:col-span-3"
          label={t("fields.email")}
          type="email"
          autoComplete="email"
          placeholder={t("fields.emailPlaceholder")}
          required
        />

        <TextField
          {...fieldProps("phone")}
          className="sm:col-span-3"
          label={t("fields.phone")}
          type="tel"
          autoComplete="tel"
          placeholder={t("fields.phonePlaceholder")}
        />

        <TextField
          {...fieldProps("arrival")}
          ref={arrivalRef}
          className="sm:col-span-2"
          label={t("fields.arrival")}
          type="date"
        />

        <TextField
          {...fieldProps("departure")}
          ref={departureRef}
          className="sm:col-span-2"
          label={t("fields.departure")}
          type="date"
        />

        <TextField
          {...fieldProps("guests")}
          className="sm:col-span-2"
          label={t("fields.guests")}
          type="number"
          inputMode="numeric"
          min={1}
          max={20}
          icon={UserMultiple02Icon}
        />

        <TextareaField
          {...fieldProps("message")}
          className="sm:col-span-6"
          label={t("fields.message")}
          rows={6}
          placeholder={t("fields.messagePlaceholder")}
          required
        />
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
