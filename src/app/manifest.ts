import type { MetadataRoute } from "next";
import { IMAGES } from "@/configuration/images.mjs";
import { STRUCTURE_NAME } from "@/configuration/site";
import { NEUTRAL, PRIMARY } from "@/style/palette.mjs";

/**
 * The web app manifest, served at `/manifest.webmanifest`.
 *
 * It used to be a static file in `public/manifest/`, which meant the property's
 * name and two of the brand colours were written out a second time and could
 * drift from `configuration/` and `style/palette.mjs` without anything noticing.
 * As a route it is derived, so there is nothing left to keep in sync.
 *
 * Deliberately outside `[locale]`: a manifest has one `name`, and the name of a
 * property is the same in every language.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: STRUCTURE_NAME,
    short_name: STRUCTURE_NAME,
    start_url: "/",
    display: "standalone",
    /** The browser tints its chrome with these, so they must match the site. */
    theme_color: PRIMARY[500],
    background_color: NEUTRAL[100],
    icons: [
      {
        src: IMAGES.brand.androidChrome192,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: IMAGES.brand.androidChrome512,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: IMAGES.brand.appleTouchIcon,
        sizes: "180x180",
        type: "image/png",
      },
      { src: IMAGES.brand.favicon32, sizes: "32x32", type: "image/png" },
      { src: IMAGES.brand.favicon16, sizes: "16x16", type: "image/png" },
    ],
  };
}
