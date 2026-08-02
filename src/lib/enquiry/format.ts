import type { EnquiryInput } from "./schema";

/** Presentation helpers shared by the host and guest enquiry emails. */

export const fullName = (enquiry: EnquiryInput) =>
  `${enquiry.firstName} ${enquiry.lastName}`;

export function nightsBetween(arrival?: string, departure?: string) {
  if (!arrival || !departure) return undefined;
  const ms = Date.parse(departure) - Date.parse(arrival);
  return ms > 0 ? Math.round(ms / 86_400_000) : undefined;
}

/** UTC throughout: the stored value is a calendar day, not an instant. */
export function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function formatStay(enquiry: EnquiryInput, locale: string) {
  if (!enquiry.arrival) return undefined;
  return enquiry.departure
    ? `${formatDate(enquiry.arrival, locale)} → ${formatDate(enquiry.departure, locale)}`
    : formatDate(enquiry.arrival, locale);
}
