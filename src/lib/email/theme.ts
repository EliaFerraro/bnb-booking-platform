import { NEUTRAL, PRIMARY, SECONDARY } from "@/style/palette.mjs";

/**
 * The brand palette, mapped onto the roles an email needs.
 *
 * The values come from `style/palette.mjs`, the same module the Tailwind theme
 * is generated from, so a colour never has to be changed twice. What cannot be
 * shared is the mechanism: mail clients resolve neither CSS custom properties
 * nor utility classes, so every rule here ends up inlined as a literal hex.
 */
export const MAIL_COLORS = {
  /** The page behind the card. */
  page: NEUTRAL[100],
  card: NEUTRAL[50],
  /** The sage header band and the type on it. */
  band: PRIMARY[500],
  bandText: PRIMARY[50],
  bandMuted: PRIMARY[200],
  heading: NEUTRAL[950],
  text: NEUTRAL[900],
  /** Labels, legal lines, metadata. */
  muted: NEUTRAL[700],
  hairline: NEUTRAL[200],
  /** The sand accent marking quoted guest text. */
  accent: SECONDARY[400],
  accentSoft: SECONDARY[50],
} as const;

/**
 * Only fonts installed on the reader's machine can be used: a `@font-face`
 * webfont is stripped by Gmail and Outlook. Georgia stands in for Cormorant
 * Garamond — the closest old-style serif present on every platform.
 */
export const MAIL_FONTS = {
  serif: "Georgia, 'Times New Roman', Times, serif",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
} as const;

/** Sized to the 600px convention every desktop client renders without scaling. */
export const MAIL_WIDTH = 600;
