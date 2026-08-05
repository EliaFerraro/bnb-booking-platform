"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/ui/components/shadcn/button";
import { TextField } from "@/ui/components/form/TextField";
import { TextareaField } from "@/ui/components/form/TextareaField";
import { DateField } from "@/ui/components/form/DateField";
import { nextDayIso } from "@/ui/components/form/Calendar";
import { mailtoHref, whatsappHref } from "@/configuration/contact";
import { submitEnquiry } from "@/lib/enquiry/actions";
import { initialEnquiryState } from "@/lib/enquiry/state";
import { enquirySchema, firstIssuePerField } from "@/lib/enquiry/schema";
import { trackEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import { EnquirySuccess, EXIT_MS } from "./EnquirySuccess";

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
  // The privacy link reuses the footer's label so the two never drift apart.
  const tf = useTranslations("footer.legal");
  const locale = useLocale();
  const pathname = usePathname();

  const [state, formAction, isPending] = useActionState(
    submitEnquiry,
    initialEnquiryState
  );

  const [values, setValues] = useState(EMPTY_VALUES);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitAttempt, setSubmitAttempt] = useState(0);

  // Success arrives in two beats — the form fades out, then the confirmation is
  // drawn on — and this is the switch between them.
  const [hasLeft, setHasLeft] = useState(false);

  useEffect(() => {
    if (state.status !== "success") return;
    const timer = setTimeout(() => setHasLeft(true), EXIT_MS);
    return () => clearTimeout(timer);
  }, [state.status]);

  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // Stamped after mount so the server renders no time-dependent value, which
  // would otherwise produce a hydration mismatch. The date pickers apply their
  // own minimums for the same reason: "today" is not knowable on the server.
  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now());
    }
    trackEvent("enquiry_form_start");
  }, []);

  // Pairs with enquiry_form_start, so the gap between the two counts is the
  // abandonment rate — the number worth knowing about a form this long.
  useEffect(() => {
    if (state.status === "success") trackEvent("enquiry_form_success");
    if (state.status === "error") trackEvent("enquiry_form_error");
  }, [state.status]);

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
    onBlur: () => markTouched(field),
  });

  /**
   * A picker has no meaningful blur, so a date counts as touched the moment it
   * is chosen — and choosing either date reveals the other's error too, since
   * the "departure needs an arrival" rule is reported on a field the guest may
   * never have opened.
   */
  const dateProps = (field: "arrival" | "departure") => ({
    name: field,
    value: values[field],
    error: errorFor(field),
    onValueChange: (value: string) => {
      handleChange(field)(value);
      markTouched("arrival", "departure");
    },
  });

  const hasClientErrors = Object.keys(clientErrors).length > 0;

  // Focus the first rejected control after a blocked submit or a server
  // rejection, so keyboard and screen-reader users are not left guessing.
  useEffect(() => {
    if (submitAttempt === 0 && !serverErrors) return;
    // The date pickers report invalidity as data rather than aria, since a
    // button role does not accept aria-invalid.
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]')
      ?.focus();
  }, [submitAttempt, serverErrors]);

  if (hasLeft && state.status === "success") {
    return <EnquirySuccess email={state.email} />;
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
          return;
        }

        // How long the guest actually took, from the same timestamp the bot
        // trap already stamps. Recorded twice on purpose: as an event, so it
        // can be compared against the abandoned attempts that never get here,
        // and on the enquiry row itself, where it survives anonymisation.
        const startedAt = Number(startedAtRef.current?.value ?? 0);
        if (startedAt > 0) {
          trackEvent("enquiry_form_submit", { value: Date.now() - startedAt });
        }
      }}
      className={cn(
        "max-w-3xl mx-auto",
        // The form is still on screen while it fades: replacing it in the same
        // frame as the confirmation would make the panel appear to jump in.
        state.status === "success" && "animate-fade-out-up pointer-events-none"
      )}
      aria-hidden={state.status === "success"}
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

        <DateField
          {...dateProps("arrival")}
          className="sm:col-span-2"
          label={t("fields.arrival")}
        />

        <DateField
          {...dateProps("departure")}
          className="sm:col-span-2"
          label={t("fields.departure")}
          // A stay is at least one night, so the arrival day itself is out.
          min={values.arrival ? nextDayIso(values.arrival) : undefined}
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

        {/* A link rather than a consent checkbox: the legal basis here is
            art. 6(1)(b), pre-contractual measures. Asking for consent that is
            not the basis would be wrong, and would create a right to withdraw
            that could block us from replying at all. */}
        <p className="text-xs text-neutral-500 leading-relaxed font-light">
          {t("privacyNote")}{" "}
          <Link
            href={`/${locale}/privacy`}
            className="normal-case underline underline-offset-4 text-neutral-600 hover:text-neutral-900"
          >
            {tf("legal.privacy")}
          </Link>
        </p>
      </div>

      <p className="mt-4 text-xs text-neutral-500">{t("requiredNote")}</p>
    </form>
  );
}

export default EnquiryForm;
