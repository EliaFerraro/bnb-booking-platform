export const PHONE_DISPLAY = "+39 339 7096 173";
export const PHONE_E164 = "+393397096173";
export const PHONE_HREF = `tel:${PHONE_E164}`;

export const EMAIL = "ilrespirodelborgobnb@gmail.com";

/**
 * Postal and licence identity, printed in the footer of every outgoing email.
 * Deliberately not translated: an address is written in the language of the
 * country that sends it, and the CIN is a code.
 */
export const ADDRESS_LINE = "Via della Pace, 24 — 14030 Montemagno (AT), Italia";
export const CIN = "IT005077C1SCRVTNU4";

/** wa.me expects the E.164 number without the leading "+". */
export const WHATSAPP_NUMBER = PHONE_E164.replace("+", "");

/**
 * Satellite view (!5e1) pinned to the verified "B&B Il respiro del borgo"
 * business listing rather than to the street address, so the property itself
 * is what the marker names.
 */
export const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2378.3064615128733!2d8.32918422280645!3d44.97954837222017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47879796d9f3d325%3A0xb81fd54187ec5bf1!2sB%26B%20Il%20respiro%20del%20borgo%2C%20CODICE%20CIN%20IT005077C1SCRVTNU4!5e1!3m2!1sit!2sit!4v1782767467060!5m2!1sit!2sit";

/**
 * mailto: query values must be percent-encoded (RFC 6068). URLSearchParams is
 * not usable here: it encodes spaces as "+", which several mail clients render
 * literally in the subject line.
 */
export function mailtoHref(subject?: string, body?: string) {
  const params = [
    subject && `subject=${encodeURIComponent(subject)}`,
    body && `body=${encodeURIComponent(body)}`,
  ].filter(Boolean);

  return params.length
    ? `mailto:${EMAIL}?${params.join("&")}`
    : `mailto:${EMAIL}`;
}

export function whatsappHref(text?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Id of the enquiry-form section on the contact page. */
export const ENQUIRY_ANCHOR = "enquiry";

/**
 * Every "write to us" call to action points here rather than at the bare
 * contact page: the guest lands on the form itself, past the direct channels
 * and the intro they have already read a version of.
 */
export function enquiryHref(locale: string) {
  return `/${locale}/contact#${ENQUIRY_ANCHOR}`;
}
