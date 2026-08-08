#!/usr/bin/env node
/**
 * Asserts that the property layer stayed a layer.
 *
 * `configuration/property.mjs` is the one place a business fact is written down,
 * so that selling this site to another B&B is an edit to that file rather than a
 * hunt through five locale files and fifteen components. Nothing in the type
 * system enforces that: the next person to add a footer, an email template or a
 * legal page can type the address in by hand and everything still compiles. This
 * catches that, the way `check-locales.mjs` catches a forgotten translation.
 *
 * It works backwards from the config — every value in `property.mjs` becomes a
 * needle — so it needs no list of what to look for and cannot go stale when a
 * fact is added. Message files are parsed rather than grepped, so a finding names
 * the offending key rather than just the file.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, sep } from "node:path";
import { PROPERTY } from "../configuration/property.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = join(ROOT, "..");

/** Never worth walking: build output, dependencies, binaries, DB history. */
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "public",
  "migrations",
]);

const SCAN_EXTENSIONS = [".ts", ".tsx", ".mjs", ".js", ".json", ".sql", ".css"];

/**
 * Files allowed to spell a fact out, and why.
 *
 * `property.mjs` is the source. `.env.example` documents the Gmail account,
 * which is an environment value that has to match the config and cannot be read
 * from it. `logo.ts` is generated from the slug and already guarded by
 * `check:email-logo`. Markdown is excluded wholesale by `SCAN_EXTENSIONS`: prose
 * written for people would be unreadable with placeholders in it.
 */
const ALLOWED_FILES = new Set([
  "src/configuration/property.mjs",
  "src/.env.example",
  "src/lib/email/logo.ts",
]);

/**
 * Facts that legitimately appear as prose, with the reason each is exempt.
 *
 * The town is the subject of whole sections of this site — the village, its
 * alleys, its castle, how far it is from the motorway. It is a place being
 * described, not an identity being stated, and it declines grammatically across
 * five languages. The country is duplicated on purpose: the config holds the
 * untranslated form for the postal line in the emails, while the contact card
 * shows a translated one, so the Italian pair necessarily coincides.
 */
const EXEMPT_PATHS = new Set(["address.town", "address.country"]);

/**
 * Message keys allowed to name the property, with the reason.
 *
 * A guest's review is a quotation. It is reproduced as they wrote it, and every
 * review is replaced wholesale when the site changes hands anyway.
 */
const ALLOWED_MESSAGE_KEYS = new Set([
  "pages.homepage.reviews.items.2.text",
]);

/**
 * Values too short to search for without drowning in false positives: a bare
 * "2" or "24" appears in every file that has ever existed. They are still
 * parametrised in the code — they are just not greppable.
 */
const MIN_NEEDLE_LENGTH = 6;

/**
 * The map URLs are long opaque blobs that legitimately contain the CIN, the town
 * and the brand name inside their query strings. Matching them as wholes is
 * useful; matching their contents inside them is noise, so they are checked
 * first and then blanked out before the shorter needles run.
 */
const URL_PATHS = new Set(["geo.mapsEmbedUrl", "geo.mapsPlaceUrl"]);

/** Flattens a nested object into [dotted.path, leaf] pairs. */
function flatten(value, path = "") {
  if (value === null || value === undefined) return [];
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      flatten(child, path ? `${path}.${key}` : key)
    );
  }
  return [[path, String(value)]];
}

const needles = flatten(PROPERTY).filter(
  ([path, value]) =>
    !EXEMPT_PATHS.has(path) && value.length >= MIN_NEEDLE_LENGTH
);
const urlNeedles = needles.filter(([path]) => URL_PATHS.has(path));
const textNeedles = needles.filter(([path]) => !URL_PATHS.has(path));

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (SCAN_EXTENSIONS.some((ext) => entry.endsWith(ext))) files.push(full);
  }
  return files;
}

const findings = [];
const report = (file, path, value, key) =>
  findings.push({ file, path, value, key });

for (const file of walk(REPO)) {
  const relPath = relative(REPO, file).split(sep).join("/");
  if (ALLOWED_FILES.has(relPath)) continue;

  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue; // unreadable or binary; nothing to assert
  }

  // Message files are parsed, so a finding can name the key that has to change.
  if (/^src\/messages\/[a-z]{2}\.json$/.test(relPath)) {
    for (const [key, text] of flatten(JSON.parse(content))) {
      if (ALLOWED_MESSAGE_KEYS.has(key)) continue;
      for (const [path, value] of textNeedles) {
        if (text.includes(value)) report(relPath, path, value, key);
      }
    }
    continue;
  }

  for (const [path, value] of urlNeedles) {
    if (content.includes(value)) report(relPath, path, value);
    content = content.split(value).join("");
  }
  for (const [path, value] of textNeedles) {
    if (content.includes(value)) report(relPath, path, value);
  }
}

if (findings.length) {
  const n = findings.length;
  console.error(
    `✖ ${n} business fact${n === 1 ? "" : "s"} written out by hand.\n` +
      `  Read it from configuration/, or interpolate it into the message:\n`
  );
  for (const { file, path, value, key } of findings) {
    const shown = value.length > 60 ? `${value.slice(0, 57)}…` : value;
    console.error(`    ${file}${key ? ` → ${key}` : ""}`);
    console.error(`      PROPERTY.${path} — "${shown}"`);
  }
  process.exit(1);
}

console.log(`✓ no business fact written out by hand (${needles.length} values checked)`);
