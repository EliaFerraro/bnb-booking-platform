import {
  ADDRESS_LINE,
  CIN,
  EMAIL,
  PHONE_DISPLAY,
} from "@/configuration/contact";
import { PROPERTY } from "@/configuration/property.mjs";
import { structureName } from "./transport";

/**
 * The masthead and the legal footer every outgoing message shares. Templates
 * spread these in rather than restating them, so a new email is branded and
 * legally complete by construction.
 */

/** Locale-neutral on purpose: it names a place, so it needs no translation. */
const KICKER = PROPERTY.brand.kicker;

export function brandHeader() {
  return { brandName: structureName(), brandKicker: KICKER };
}

/**
 * A postal address and a real identity in the footer are what separate a
 * transactional email from a spam one, for filters and for readers alike.
 */
export function brandFooterLines(): string[] {
  return [
    structureName(),
    ADDRESS_LINE,
    `CIN ${CIN}`,
    `${PHONE_DISPLAY} · ${EMAIL}`,
  ];
}
