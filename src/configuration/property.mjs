/**
 * THE PROPERTY FILE — every fact about the business that runs on this site.
 *
 * This is the tenant layer. Nothing below `configuration/` knows which B&B it is
 * serving: routes, components and `lib/` read the values from here through the
 * other modules in this folder. Selling this site to a different property means
 * editing this one file, swapping the photos in `public/img/`, rewriting the
 * prose in `messages/*.json` and picking new colours in `style/palette.mjs`.
 * `docs/Rebranding.md` is the full checklist.
 *
 * What belongs here: facts. A phone number, a capacity, a licence code — things
 * that are true of the property and identical in every language.
 * What does not: prose (it is translated, so it lives in `messages/*.json`) and
 * secrets (they are per-deployment, so they live in the environment — see
 * `lib/env.ts`). Colours are the one deliberate exception: they stay in
 * `style/palette.mjs`, because Tailwind's generator needs them on their own.
 *
 * Plain .mjs rather than .ts for the same reason `style/palette.mjs` is: the
 * generator scripts in `scripts/` must import it with no build step, while
 * TypeScript still reads it through `allowJs`.
 *
 * `npm run check:config` fails if any value here is also written out by hand
 * somewhere else in the tree.
 */

export const PROPERTY = {
  brand: {
    /** Shown in every <title>, the footer, the hero and every outgoing email. */
    name: "Il Respiro del Borgo",

    /**
     * Lowercase, no spaces or punctuation. Used where a name has to be an
     * identifier rather than a label: the consent cookie, the local database
     * role and the inline logo filename in the emails. Changing it renames the
     * consent cookie, which makes every visitor's stored choice unreadable and
     * shows them the banner again — an acceptable one-off cost when the site
     * changes hands, and never worth doing otherwise.
     */
    slug: "ilrespirodelborgo",

    /** Under the name in the email masthead. A place, so it is not translated. */
    kicker: "Montemagno · Monferrato",

    /** Official tourist-board classification, rendered as that many stars. */
    stars: 2,
  },

  contact: {
    /**
     * The public address, shown in the footer and on the contact page. It must
     * match the `SMTP_USER` in the environment: that is the Gmail account the
     * enquiry mail is actually sent from, so a mismatch means guests reply to
     * an inbox nobody reads.
     */
    email: "ilrespirodelborgo@gmail.com",

    /** As a human reads it. Only ever displayed, never used in a link. */
    phoneDisplay: "+39 339 7096 173",

    /** E.164, for `tel:` and WhatsApp. Digits and one leading "+", nothing else. */
    phoneE164: "+393397096173",
  },

  /**
   * Kept in parts rather than as one string so the footer can print the street
   * on its own line, the emails can print the whole thing, and neither has to
   * re-split the other's format.
   *
   * The region has no entry here on purpose. It appears in exactly one place —
   * the contact card — where guests read it in their own language, so it lives
   * with the rest of the translated copy under
   * `pages.contact.cards.regionCountry`. The country is here because the postal
   * line in the emails needs it, and an address is written in the language of
   * the country that has to deliver it.
   */
  address: {
    street: "Via della Pace, 24",
    postalCode: "14030",
    town: "Montemagno",
    province: "AT",
    country: "Italia",
  },

  legal: {
    /** Codice Identificativo Nazionale. Required by law on every listing page. */
    cin: "IT005077C1SCRVTNU4",

    /**
     * None, and correctly so: letting rooms in one's own home below the regional
     * threshold is not an entrepreneurial activity, so there is no VAT number to
     * publish. Set it to a string if that ever changes.
     */
    vat: null,
  },

  geo: {
    lat: 44.97954837222017,
    lng: 8.32918422280645,

    /**
     * Satellite view (!5e1) pinned to the verified "B&B Il respiro del borgo"
     * business listing rather than to the street address, so the property itself
     * is what the marker names. Regenerate by opening the listing on Google
     * Maps, choosing Share > Embed a map, and copying the `src`.
     */
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2378.3064615128733!2d8.32918422280645!3d44.97954837222017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47879796d9f3d325%3A0xb81fd54187ec5bf1!2sB%26B%20Il%20respiro%20del%20borgo%2C%20CODICE%20CIN%20IT005077C1SCRVTNU4!5e1!3m2!1sit!2sit!4v1782767467060!5m2!1sit!2sit",

    /**
     * The same place as an ordinary link rather than an embed. Two callers need
     * it: visitors who decline the map, and the "read the reviews" link. An
     * outbound link they choose to follow sends nothing to Google until they
     * click it, so it needs no consent.
     */
    mapsPlaceUrl:
      "https://www.google.com/maps/search/?api=1&query=B%26B+Il+respiro+del+borgo+Montemagno",
  },

  /** What the property offers. Rendered on the structure and contact pages. */
  stay: {
    maxGuests: 2,

    /** Room plus bathroom, in square metres. */
    roomSizeSqm: 37,

    /**
     * Hours as [hour, minute] in the property's own time, formatted per locale
     * at render time by `formatTime` in `configuration/stay.ts`. Numbers rather
     * than strings because English writes them as am/pm and Italian does not —
     * a string here would have to be translated, and then it would stop being a
     * fact and start being copy in five places.
     */
    checkInFrom: [15, 0],
    checkInTo: [20, 0],
    checkOutBy: [10, 30],

    /** The promise made on the contact page and in the acknowledgement email. */
    responseHours: 24,
  },

  /**
   * The public rating, shown on the homepage next to the link to the reviews.
   * Update by hand when it moves: reading it from Google would need an API key
   * and would put a third party on the render path of the homepage.
   */
  reviews: {
    average: 4.9,
    /** Rounded, for the row of filled stars beside the average. */
    stars: 5,
  },
};
