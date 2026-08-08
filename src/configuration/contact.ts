/**
 * How to reach the property, and the identity that has to appear beside it.
 *
 * Every value is derived from `configuration/property.mjs` — this module exists
 * to give the rest of the app stable names and the two href builders, not to
 * hold data. Change a number or an address there, not here.
 */

import { PROPERTY } from "./property.mjs";

export const PHONE_DISPLAY = PROPERTY.contact.phoneDisplay;
export const PHONE_E164 = PROPERTY.contact.phoneE164;
export const PHONE_HREF = `tel:${PHONE_E164}`;

export const EMAIL = PROPERTY.contact.email;

/**
 * Postal and licence identity, printed in the footer of every outgoing email.
 * Deliberately not translated: an address is written in the language of the
 * country that sends it, and the CIN is a code.
 *
 * The parts are exported too, because the footer and the contact card print the
 * street on its own line above the locality rather than as one run of text.
 */
export const ADDRESS_STREET = PROPERTY.address.street;
export const ADDRESS_LOCALITY = `${PROPERTY.address.postalCode} ${PROPERTY.address.town} (${PROPERTY.address.province})`;
export const ADDRESS_LINE = `${ADDRESS_STREET} — ${ADDRESS_LOCALITY}, ${PROPERTY.address.country}`;

export const CIN = PROPERTY.legal.cin;

/** wa.me expects the E.164 number without the leading "+". */
export const WHATSAPP_NUMBER = PHONE_E164.replace("+", "");

export const GOOGLE_MAPS_EMBED_URL = PROPERTY.geo.mapsEmbedUrl;

/**
 * The place as an ordinary link rather than an embed. Serves both the visitors
 * who decline the map and the "read the reviews" link on the homepage: Google
 * shows the reviews on the listing this points at, so one URL covers both and
 * there is nothing to keep in sync.
 */
export const GOOGLE_MAPS_PLACE_URL = PROPERTY.geo.mapsPlaceUrl;

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
