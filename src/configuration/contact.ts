export const PHONE_DISPLAY = "+39 339 7096 173";
export const PHONE_E164 = "+393397096173";
export const PHONE_HREF = `tel:${PHONE_E164}`;

export const EMAIL = "ilrespirodelborgobnb@gmail.com";

/** wa.me expects the E.164 number without the leading "+". */
export const WHATSAPP_NUMBER = PHONE_E164.replace("+", "");

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
