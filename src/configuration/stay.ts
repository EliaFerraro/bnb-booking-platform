/**
 * What the property offers, and the one piece of formatting it needs.
 *
 * These numbers used to be written out as strings inside all five message files
 * — "2", "37 m²", "15 – 20", "3 – 8 pm" — which meant changing the check-in time
 * was a fifteen-place edit and a translation risk. They are facts, so they come
 * from `configuration/property.mjs`; only the labels around them are translated.
 */

import { PROPERTY } from "./property.mjs";

export const MAX_GUESTS = PROPERTY.stay.maxGuests;
export const ROOM_SIZE_SQM = PROPERTY.stay.roomSizeSqm;
export const RESPONSE_HOURS = PROPERTY.stay.responseHours;

export const CHECK_IN_FROM = PROPERTY.stay.checkInFrom;
export const CHECK_IN_TO = PROPERTY.stay.checkInTo;
export const CHECK_OUT_BY = PROPERTY.stay.checkOutBy;

/**
 * Renders an [hour, minute] pair the way the guest's own language writes it:
 * "15:00" in Italian, German, French and Spanish, "3:00 PM" in English. That
 * difference is exactly why the times are stored as numbers — a single string
 * could not be right in both, and translating it would put the fact back into
 * the message files.
 *
 * The date is arbitrary and fixed: Intl needs a Date to format, and pinning it
 * to UTC keeps the output independent of where the server happens to be.
 */
export function formatTime(locale: string, time: number[]): string {
  const [hour, minute] = time;
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, 0, 1, hour, minute)));
}
