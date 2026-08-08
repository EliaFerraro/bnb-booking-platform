/**
 * Identity and absolute-URL resolution for metadata.
 *
 * `metadataBase` has to be an absolute origin: Open Graph and hreflang tags are
 * read by machines that never saw the current request, so a relative path is
 * useless to them. The origin is resolved in three steps so that previews, the
 * production deployment and `next dev` all produce correct tags without anyone
 * having to remember to change a value.
 */

import { IMAGES } from "./images.mjs";
import { PROPERTY } from "./property.mjs";

/** Set this once a custom domain exists — it wins over the Vercel URLs. */
const configured = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * Injected by Vercel. `VERCEL_PROJECT_PRODUCTION_URL` is the stable production
 * domain and is the same on every deployment; `VERCEL_URL` is the per-
 * deployment hostname and is what a preview build should advertise.
 */
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const vercelDeployment = process.env.VERCEL_URL;

function resolveSiteUrl(): string {
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production" && vercelProduction) {
    return `https://${vercelProduction}`;
  }
  if (vercelDeployment) return `https://${vercelDeployment}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/**
 * The property's name, from `configuration/property.mjs`. It used to be an
 * environment variable with the literal duplicated as a fallback here and in
 * `lib/email/transport.ts`; it is not a secret and it is not per-deployment, so
 * a config file is the right home. Keeping it in the environment as well would
 * only let a stale dashboard value silently override the file.
 */
export const STRUCTURE_NAME = PROPERTY.brand.name;

/** Pre-rendered at 1200x630 by `npm run gen:og-image`. */
export const OG_IMAGE_PATH = IMAGES.brand.ogCover;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
