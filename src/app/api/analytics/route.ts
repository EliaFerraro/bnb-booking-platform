import { analyticsPayloadSchema } from "@/lib/analytics/schema";
import {
  recordDuration,
  recordEvent,
  recordPageView,
} from "@/lib/analytics/repository";
import { visitorCountry, visitorHash } from "@/lib/analytics/visitor";

/**
 * Collection endpoint for first-party site measurement.
 *
 * Deliberately unauthenticated and deliberately dull. Everything that could
 * identify a visitor — the hash, the country — is derived here from request
 * headers rather than accepted from the body, because a value the client can
 * choose measures nothing and records too much.
 *
 * Always answers 204. The response tells the browser nothing about whether the
 * write happened, which is both correct (measurement is not the visitor's
 * concern) and useful (`sendBeacon` cannot read a response anyway).
 */

// postgres.js opens raw TCP sockets, which the Edge runtime cannot do.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 1024;

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 204 });

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 204 });
  }

  const payload = analyticsPayloadSchema.safeParse(parsedJson);
  if (!payload.success) return new Response(null, { status: 204 });

  // A duration only names a view that already exists and carries nothing about
  // who sent it, so it skips the hashing entirely — one fewer salt lookup on
  // the beacon that fires as the visitor is leaving.
  if (payload.data.type === "duration") {
    await recordDuration(payload.data);
    return new Response(null, { status: 204 });
  }

  const [hash, country] = await Promise.all([visitorHash(), visitorCountry()]);
  const context = { visitorHash: hash, country };

  if (payload.data.type === "pageview") {
    await recordPageView(payload.data, context);
  } else {
    await recordEvent(payload.data, context);
  }

  return new Response(null, { status: 204 });
}
