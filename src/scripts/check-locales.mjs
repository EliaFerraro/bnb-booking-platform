#!/usr/bin/env node
/**
 * The five locale files are edited in parallel and nothing in the type system
 * links them: a key added to it.json but forgotten in de.json only surfaces as
 * a runtime MISSING_MESSAGE in production. This asserts they stay identical in
 * shape, using it.json (the default locale) as the reference.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const MESSAGES_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "messages");
const REFERENCE = "it";
const LOCALES = ["it", "en", "de", "fr", "es"];

// Arrays are descended into as well (Object.entries yields their indices), so
// a locale that lost one of the six review entries is caught too.
const keyPaths = (value, prefix = "") =>
  Object.entries(value).flatMap(([key, child]) =>
    child && typeof child === "object"
      ? keyPaths(child, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  );

const load = (locale) => {
  const file = join(MESSAGES_DIR, `${locale}.json`);
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`✖ ${locale}.json is not valid JSON: ${error.message}`);
    process.exit(1);
  }
};

const reference = keyPaths(load(REFERENCE));
const referenceSet = new Set(reference);
let failed = false;

for (const locale of LOCALES.filter((l) => l !== REFERENCE)) {
  const current = keyPaths(load(locale));
  const currentSet = new Set(current);

  const missing = reference.filter((key) => !currentSet.has(key));
  const extra = current.filter((key) => !referenceSet.has(key));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`✖ ${locale}.json differs from ${REFERENCE}.json`);
    for (const key of missing) console.error(`    missing: ${key}`);
    for (const key of extra) console.error(`    unexpected: ${key}`);
  }
}

if (failed) {
  console.error("\nAll locale files must share the same key set.");
  process.exit(1);
}

console.log(`✓ ${LOCALES.length} locale files in sync (${reference.length} keys)`);
