import {
  fullName,
  formatDate,
  formatStay,
  nightsBetween,
} from "@/lib/enquiry/format";
import type { EnquiryInput } from "@/lib/enquiry/schema";
import { brandHeader } from "../brand";
import { renderHtml, renderText, type MailDocument, type MailRow } from "../layout";
import { hostInbox, structureName, type OutgoingMail } from "../transport";

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

const HOST_LOCALE = "it";

/** tel: accepts only digits and a leading plus; free-text input rarely does. */
function telHref(phone?: string) {
  if (!phone) return undefined;
  const dialable = phone.replace(/[^\d+]/g, "");
  return dialable.length >= 6 ? `tel:${dialable}` : undefined;
}

function rows(enquiry: EnquiryInput, language: string): MailRow[] {
  const nights = nightsBetween(enquiry.arrival, enquiry.departure);

  return [
    { label: "Ospite", value: fullName(enquiry) },
    {
      label: "Email",
      value: enquiry.email,
      href: `mailto:${enquiry.email}`,
    },
    {
      label: "Telefono",
      value: enquiry.phone ?? "non indicato",
      href: telHref(enquiry.phone),
    },
    { label: "Lingua", value: language },
    {
      label: "Arrivo",
      value: enquiry.arrival
        ? formatDate(enquiry.arrival, HOST_LOCALE)
        : "non indicato",
    },
    {
      label: "Partenza",
      value: enquiry.departure
        ? formatDate(enquiry.departure, HOST_LOCALE)
        : "non indicata",
    },
    { label: "Notti", value: nights ? String(nights) : "—" },
    { label: "Ospiti", value: enquiry.guests ? String(enquiry.guests) : "non indicato" },
  ];
}

/**
 * Sent to the host with Reply-To set to the guest. Pressing Reply in Gmail
 * opens a direct guest-to-host thread and this system is out of the loop from
 * that point on.
 */
export function buildHostEnquiryMail(enquiry: EnquiryInput): OutgoingMail {
  const language =
    LANGUAGE_NAMES[enquiry.locale] ?? enquiry.locale.toUpperCase();
  const stay = formatStay(enquiry, HOST_LOCALE);
  const receivedAt = new Date().toLocaleString("it-IT", {
    timeZone: "Europe/Rome",
    dateStyle: "long",
    timeStyle: "short",
  });

  const replySubject = `Re: la vostra richiesta — ${structureName()}`;

  const doc: MailDocument = {
    lang: HOST_LOCALE,
    ...brandHeader(),
    preheader: `${fullName(enquiry)} · ${stay ?? "date non indicate"} · ${
      enquiry.guests ? `${enquiry.guests} ospiti` : "ospiti non indicati"
    }`,
    eyebrow: "Nuova richiesta",
    heading: fullName(enquiry),
    intro: [
      `Richiesta arrivata dal modulo di contatto del sito. L'ospite scrive in ${language.toLowerCase()}: rispondete in questa lingua.`,
    ],
    rowsTitle: "Dettagli",
    rows: rows(enquiry, language),
    quote: { label: "Messaggio", text: enquiry.message },
    buttons: [
      {
        label: `Rispondi a ${enquiry.firstName}`,
        href: `mailto:${enquiry.email}?subject=${encodeURIComponent(replySubject)}`,
      },
      ...(telHref(enquiry.phone)
        ? [
            {
              label: `Chiama ${enquiry.phone}`,
              href: telHref(enquiry.phone)!,
              variant: "secondary" as const,
            },
          ]
        : []),
    ],
    closing:
      "Rispondendo a questa email scrivete direttamente all'ospite: la risposta non passa dal sito.",
    footerLines: [
      `Pagina di origine: ${enquiry.sourcePath ?? "—"}`,
      `Ricevuta il ${receivedAt}`,
    ],
  };

  return {
    to: hostInbox(),
    replyTo: enquiry.email,
    subject: `Richiesta — ${fullName(enquiry)}${
      enquiry.arrival ? ` — ${enquiry.arrival}` : ""
    } (${language})`,
    text: renderText(doc),
    html: renderHtml(doc),
  };
}
