import { getTranslations } from "next-intl/server";
import { PHONE_DISPLAY } from "@/configuration/contact";
import type { EnquiryInput } from "./schema";
import { hostInbox, sendMail, structureName } from "./transport";

/**
 * Host-facing copy is hardcoded in Italian on purpose: it is operator text read
 * only by the host, so translating it into five languages would be noise. The
 * guest's own language is stated in the body so the host knows how to reply.
 */
const LANGUAGE_NAMES: Record<string, string> = {
  it: "Italiano",
  en: "Inglese",
  de: "Tedesco",
  fr: "Francese",
  es: "Spagnolo",
};

function nightsBetween(arrival?: string, departure?: string) {
  if (!arrival || !departure) return undefined;
  const ms = Date.parse(departure) - Date.parse(arrival);
  return ms > 0 ? Math.round(ms / 86_400_000) : undefined;
}

function formatStay(enquiry: EnquiryInput, locale: string) {
  if (!enquiry.arrival) return undefined;
  return enquiry.departure
    ? `${formatDate(enquiry.arrival, locale)} → ${formatDate(enquiry.departure, locale)}`
    : formatDate(enquiry.arrival, locale);
}

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Sent to the host with Reply-To set to the guest. Pressing Reply in Gmail
 * opens a direct guest-to-host thread and this system is out of the loop from
 * that point on.
 */
export async function notifyHost(enquiry: EnquiryInput) {
  const language =
    LANGUAGE_NAMES[enquiry.locale] ?? enquiry.locale.toUpperCase();
  const nights = nightsBetween(enquiry.arrival, enquiry.departure);

  const lines = [
    "Nuova richiesta ricevuta dal sito.",
    "",
    `Nome:        ${enquiry.name}`,
    `Email:       ${enquiry.email}`,
    `Telefono:    ${enquiry.phone ?? "—"}`,
    `Lingua:      ${language}  ← rispondere in questa lingua`,
    "",
    `Arrivo:      ${enquiry.arrival ?? "non indicato"}`,
    `Partenza:    ${enquiry.departure ?? "non indicata"}`,
    `Notti:       ${nights ?? "—"}`,
    `Ospiti:      ${enquiry.guests ?? "non indicato"}`,
    "",
    "Messaggio:",
    enquiry.message,
    "",
    "———",
    `Pagina di origine: ${enquiry.sourcePath ?? "—"}`,
    `Ricevuta: ${new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" })}`,
    "",
    "Rispondi a questa email per scrivere direttamente all'ospite.",
  ];

  await sendMail({
    to: hostInbox(),
    replyTo: enquiry.email,
    subject: `Richiesta — ${enquiry.name}${
      enquiry.arrival ? ` — ${enquiry.arrival}` : ""
    } (${language})`,
    text: lines.join("\n"),
  });
}

/**
 * Sent to the guest in their own language, from the same Gmail account, so a
 * reply lands back in the host's inbox as an ordinary email.
 */
export async function acknowledgeGuest(enquiry: EnquiryInput) {
  const t = await getTranslations({
    locale: enquiry.locale,
    namespace: "enquiryEmail",
  });

  const stay = formatStay(enquiry, enquiry.locale);

  const lines = [
    t("greeting", { name: enquiry.name }),
    "",
    t("received"),
    "",
    t("summaryTitle"),
    stay ? `- ${t("labelDates")}: ${stay}` : null,
    enquiry.guests ? `- ${t("labelGuests")}: ${enquiry.guests}` : null,
    "",
    `${t("labelMessage")}:`,
    enquiry.message,
    "",
    t("urgent", { phone: PHONE_DISPLAY }),
    "",
    t("replyable"),
    "",
    t("signature", { structure: structureName() }),
  ].filter((line) => line !== null);

  await sendMail({
    to: enquiry.email,
    subject: t("subject", { structure: structureName() }),
    text: lines.join("\n"),
  });
}
