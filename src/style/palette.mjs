/**
 * The single source of truth for the brand palette.
 *
 * Two consumers need these values and cannot share a stylesheet: Tailwind, via
 * the generated `palette.css`, and the HTML email templates, which must inline
 * literal hex values because mail clients resolve no custom properties.
 *
 * Plain .mjs rather than .ts so the generator script can import it with no
 * build step, while TypeScript still reads it through `allowJs`.
 *
 * Edit a scale here, then run `npm run gen:palette` to rewrite palette.css.
 * `npm run verify` fails if the two have drifted apart.
 */

/** Verde salvia — the brand's primary. */
export const PRIMARY = {
  50: "#f3f5e9",
  100: "#e5e9d2",
  200: "#cad2a7",
  300: "#adb87f",
  400: "#93a064",
  500: "#7d844f",
  600: "#6b7144",
  700: "#585d38",
  800: "#464a2c",
  900: "#393c24",
  950: "#202214",
};

/** Sabbia — the warm accent used for secondary surfaces. */
export const SECONDARY = {
  50: "#fbf6f0",
  100: "#f5e9dd",
  200: "#e7cfb9",
  300: "#d9b89c",
  400: "#c99f7f",
  500: "#b18868",
  600: "#927056",
  700: "#755a45",
  800: "#584334",
  900: "#3b2d23",
  950: "#211914",
};

/** A warm grey, never a pure neutral: it carries the same earth undertone. */
export const NEUTRAL = {
  50: "#fdfdfd",
  100: "#efede1",
  200: "#dddbd5",
  300: "#c5c2bc",
  400: "#afaba4",
  500: "#9a938d",
  600: "#817b76",
  700: "#696460",
  800: "#504d4a",
  900: "#383532",
  950: "#201e1d",
};

/** Keyed by the name Tailwind exposes them under (`--color-<name>-<step>`). */
export const PALETTE = {
  primary: PRIMARY,
  secondary: SECONDARY,
  neutral: NEUTRAL,
};
