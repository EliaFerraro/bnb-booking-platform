# Rebranding

How to point this site at a different property.

The codebase is split so that the answer is short. Routes, components and `lib/`
know nothing about which B&B they are serving; they read everything from three
places. Nothing under `src/app/`, `src/ui/` or `src/lib/` should need touching.

| Layer | Lives in | What you do |
| :--- | :--- | :--- |
| **Property** — the facts | `src/configuration/property.mjs` | edit the values |
| **Content** — prose, photographs, colours | `src/messages/*.json`, `src/public/img/`, `src/style/palette.mjs` | rewrite / swap |
| **Structure** — everything else | `src/app/`, `src/ui/`, `src/lib/` | leave alone |

---

## 1. The facts — `src/configuration/property.mjs`

One object, read top to bottom. Name, slug, kicker, star rating, email, both
phone forms, address in parts, CIN, VAT, coordinates, the two Google Maps URLs,
capacity, room size, check-in and check-out times, response-time promise, review
score.

Two of those deserve a warning:

- **`brand.slug`** also names the consent cookie, the local Postgres role and the
  logo file attached to every email. Changing it re-shows the cookie banner to
  every existing visitor, which is correct when the site changes hands and
  pointless otherwise. It must be a bare identifier — lowercase, digits,
  underscores — or `npm run db:bootstrap` will refuse to run.
- **`contact.email`** must match `SMTP_USER` in the environment (§5). The config
  value is what a guest is shown; `SMTP_USER` is where the mail actually comes
  from. If they differ, guests reply into an inbox nobody reads.

`stay.checkInFrom` and friends are `[hour, minute]` pairs, not strings, because
English renders them as am/pm and the other four locales do not. Give the numbers
and every language formats itself.

## 2. The photographs — `src/public/img/` + `src/configuration/images.mjs`

Drop the new files into `public/img/photos/` and `public/img/brand/`, then point
the keys in `images.mjs` at them. The keys are named by the role a photograph
plays — `home.hero`, `structure.room`, `environment.castle` — so the filenames on
disk can be anything.

Two entries feed generators rather than pages: `brand.logo` is inlined into the
emails, and `ogSource` is cropped to produce `brand.ogCover`. Re-run the
generators in §4 after changing either. Do not edit `brand.ogCover` by hand.

## 3. The words — `src/messages/*.json`

Five files, one per locale, `it.json` being the reference. This is where the
rewriting actually happens: taglines, page copy, the reviews, the legal notices,
and the `images.*` alt text for every photograph swapped in §2.

Facts must not be typed back in here. Where copy needs to name the property, its
address, its check-in time or its licence code, the message takes a placeholder —
`{brand}`, `{cin}`, `{from}`, `{hours}` — and the component supplies it from the
config. `pages.terms.sections.scope.owner` is the pattern to copy.

Keep the key sets identical across all five files: `npm run check:locales`
enforces it, and it descends into arrays, so array lengths are part of the
contract too. Do not model prose as an array.

## 4. The colours — `src/style/palette.mjs`

Three eleven-step scales. Edit them, then regenerate — Tailwind reads the
generated CSS, and the emails inline literal hex values because mail clients
resolve no custom properties. The web app manifest takes its two theme colours
from here as well.

```sh
cd src
npm run gen:palette      # style/palette.mjs  -> style/palette.css
npm run gen:email-logo   # public/img/brand/logo.png -> lib/email/logo.ts
npm run gen:og-image     # IMAGES.ogSource    -> public/img/brand/og-cover.jpg
```

## 5. The environment

Copy `src/.env.example` to `.env.local` and fill it in; set the same variables in
the hosting dashboard. Only secrets and per-deployment values live there —
`SMTP_USER`, `SMTP_APP_PASSWORD`, `ENQUIRY_TO`, `NEXT_PUBLIC_SITE_URL`,
`DATABASE_URL`, `DIRECT_DATABASE_URL`, `IP_HASH_SECRET`, `CRON_SECRET`.

## 6. Check it

```sh
cd src
npm run verify
```

`check:config` is the one that matters here. It walks the whole repository and
fails if any value from `property.mjs` has been written out by hand somewhere
else, naming the file and — inside the message files — the exact key. It is what
stops this separation from rotting on the first hurried commit.

Then run it and look at it, in at least two locales: `en` is where the times
switch to am/pm and where the translated region tail on the contact card differs
from the untranslated one used in the emails.

```sh
npm run dev
```

Worth opening by hand: the homepage hero and review score, `/structure` for the
four figures under the room, `/contact` for the address and check-in cards,
`/privacy` for the controller block, the footer of any page for the licence code
and classification, and `/manifest.webmanifest` for the name and colours. Then
submit a real enquiry and read both emails.

---

## What is deliberately still per-property prose

Three things look like facts and are not, and `check:config` exempts them with
the reason stated in the script:

- **The town.** It is the subject of whole sections — its alleys, its castle, how
  far it is from the motorway — and it declines grammatically across the five
  languages. It is a place being described, not an identity being stated.
- **The country.** The config holds the untranslated form for the postal line in
  the emails; the contact card shows a translated one. The Italian pair therefore
  coincides on purpose. The region is not in the config at all — it appears only
  on that card, so it lives entirely with the translated copy.
- **The guest reviews.** A review is a quotation, reproduced as it was written.
  They are replaced wholesale anyway.
