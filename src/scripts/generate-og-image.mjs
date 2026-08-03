#!/usr/bin/env node
/**
 * Writes `public/img/brand/og-cover.jpg` — the preview card shown when the site
 * is shared on WhatsApp, Facebook or iMessage.
 *
 * The source photograph is several megabytes and the wrong shape. Scrapers do
 * not resize: they fetch the file as-is, and most of them give up on anything
 * large or slow, so the card silently disappears. This crops the photo to the
 * 1.91:1 box every scraper expects and compresses it to a size they will
 * actually wait for.
 *
 * `--check` (wired into `npm run verify`) fails if the source photo changed
 * without this being regenerated.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "public", "img", "photos", "yard-sunset.jpg");
const OUTPUT = join(ROOT, "public", "img", "brand", "og-cover.jpg");
const STAMP = join(ROOT, "public", "img", "brand", "og-cover.source");

/** The ratio Facebook, WhatsApp and iMessage all crop to. */
const WIDTH = 1200;
const HEIGHT = 630;

async function render(source) {
  return sharp(source)
    .resize({
      width: WIDTH,
      height: HEIGHT,
      fit: "cover",
      // The horizon and the house sit in the upper half of the frame; a centre
      // crop would keep mostly lawn.
      position: "top",
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

const source = readFileSync(SOURCE);
const sourceHash = createHash("sha256").update(source).digest("hex").slice(0, 12);
const stamp = `${sourceHash}\n`;

if (process.argv.includes("--check")) {
  let actual = "";
  try {
    actual = readFileSync(STAMP, "utf8");
  } catch {
    actual = "";
  }

  if (actual !== stamp) {
    console.error(
      "✖ public/img/brand/og-cover.jpg is out of date — run 'npm run gen:og-image'."
    );
    process.exit(1);
  }

  console.log("✓ og-cover.jpg matches its source photograph");
} else {
  const image = await render(source);
  writeFileSync(OUTPUT, image);
  writeFileSync(STAMP, stamp, "utf8");
  const kb = (image.length / 1024).toFixed(0);
  console.log(`✓ wrote public/img/brand/og-cover.jpg (${WIDTH}x${HEIGHT}, ${kb} kB)`);
}
