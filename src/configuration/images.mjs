/**
 * Every photograph the site renders, in one place, named by the role it plays.
 *
 * The paths used to be typed inline in the fifteen components that render them,
 * which made "change the photos" a fifteen-file hunt with no list to check
 * against. Naming them by role instead of by subject is the point: a new owner
 * puts their own files in `public/img/`, points these keys at them, and every
 * page picks them up — the components ask for `IMAGES.rooms.detail`, not for a
 * particular hillside.
 *
 * Paths only, not alt text: alt text is prose, it is translated, and it belongs
 * in `messages/*.json` beside the rest of the page's copy. The gallery entries
 * carry an `altKey` naming the message to look up rather than the text itself.
 *
 * Two of these files are also inputs to generators — `brand.logo` is inlined
 * into the emails by `npm run gen:email-logo`, and `ogSource` is cropped into
 * `brand.ogCover` by `npm run gen:og-image`. Repoint those and re-run both.
 *
 * Plain .mjs rather than .ts for the same reason `property.mjs` and
 * `style/palette.mjs` are: those generator scripts have to import it with no
 * build step, while TypeScript still reads it through `allowJs`.
 */

export const IMAGES = {
  brand: {
    /** Navbar and mobile sidebar, and inlined into every outgoing email. */
    logo: "/img/brand/logo.png",
    /** Generated. Do not replace by hand — see `ogSource` below. */
    ogCover: "/img/brand/og-cover.jpg",
    favicon: "/img/brand/favicon.ico",
    favicon32: "/img/brand/favicon-32x32.png",
    favicon16: "/img/brand/favicon-16x16.png",
    appleTouchIcon: "/img/brand/apple-touch-icon.png",
    androidChrome192: "/img/brand/android-chrome-192x192.png",
    androidChrome512: "/img/brand/android-chrome-512x512.png",
  },

  /**
   * The homepage, top to bottom. `hero` is the largest contentful paint on the
   * site, so it is the one image loaded with `priority`.
   */
  home: {
    hero: "/img/photos/yard-sunset.jpg",
    house: "/img/photos/house-sunset.jpg",
    room: "/img/photos/room-detail.jpg",
    breakfast: "/img/photos/breakfast-table.jpg",
    hills: "/img/photos/hills-monferrato.jpg",
    village: "/img/photos/village-montemagno.png",
    /** Side by side in the "about us" section, left then right. */
    portraitLeft: "/img/photos/portrait-lorenzo.jpg",
    portraitRight: "/img/photos/portrait-margherita.jpg",
  },

  structure: {
    hero: "/img/photos/house-sunset.jpg",
    house: "/img/photos/house-aerial.jpg",
    room: "/img/photos/room-bedroom.jpg",
    /** `altKey` resolves against the `pages.structure.images` messages. */
    gallery: [
      { src: "/img/photos/garden-yard.jpg", altKey: "yard" },
      { src: "/img/photos/room-corner.jpg", altKey: "room" },
      { src: "/img/photos/room-bathroom.jpg", altKey: "bathroom" },
      { src: "/img/photos/terrace-veranda.jpg", altKey: "veranda" },
    ],
  },

  environment: {
    hero: "/img/photos/landscape-golden-hour.jpg",
    village: "/img/photos/village-spring.jpg",
    castle: "/img/photos/castle-vineyard.jpg",
    /** `altKey` resolves against the `pages.environment.images` messages. */
    gallery: [
      { src: "/img/photos/village-winter-evening.jpg", altKey: "villageWinter" },
      { src: "/img/photos/landscape-view.jpg", altKey: "hillsView" },
      { src: "/img/photos/orchard-blossoms.jpg", altKey: "vines" },
      { src: "/img/photos/sunset-sky.jpg", altKey: "sunset" },
    ],
  },

  services: {
    hero: "/img/photos/breakfast-outdoor.jpg",
    breakfast: "/img/photos/breakfast-table.jpg",
  },

  contact: {
    hero: "/img/photos/courtyard-sunset.jpg",
  },

  /**
   * Cropped to 1200x630 to produce `brand.ogCover`. Kept out of the groups
   * above because nothing renders it directly — it is a generator input, and
   * `scripts/generate-og-image.mjs` reads this key.
   */
  ogSource: "/img/photos/yard-sunset.jpg",
};
