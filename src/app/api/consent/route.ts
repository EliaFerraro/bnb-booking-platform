import { consentPayloadSchema } from "@/lib/consent/schema";
import { recordConsent } from "@/lib/consent/repository";
import { clientIpHash, userAgent } from "@/lib/privacy/ip";

/**
 * Records a cookie decision in the audit log.
 *
 * A Route Handler rather than a Server Action on purpose: invoking a Server
 * Action re-renders the current route's server components and ships an RSC
 * payload back with the response. For a write-only log that is pure waste on
 * every banner click, and it can cause visible churn on the page the visitor is
 * reading. This is a plain fetch that returns 204.
 *
 * proxy.ts excludes /api both in its matcher and in its body, so no locale
 * redirect can interfere with the POST.
 */

// postgres.js opens raw TCP sockets, which the Edge runtime cannot do.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A well-formed decision is a few hundred bytes; this is generous. */
const MAX_BODY_BYTES = 1024;

export async function POST(request: Request) {
  const raw = await request.text();

  // The body lands in a jsonb column, so the size cap and the strict schema
  // below are what stop this endpoint being used to write arbitrary blobs.
  if (raw.length > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }

  const payload = consentPayloadSchema.safeParse(parsedJson);
  if (!payload.success) {
    return new Response(null, { status: 400 });
  }

  // Both read from the request headers. A client-supplied IP would be worth
  // nothing as evidence, and accepting one would let anybody write arbitrary
  // addresses into the log.
  const [ipHash, agent] = await Promise.all([clientIpHash(), userAgent()]);

  await recordConsent(payload.data, { ipHash, userAgent: agent });

  // 204 regardless of whether the insert landed: the visitor's choice is
  // already in effect from the cookie, and a failure to log it must never
  // surface as an error in the interface.
  return new Response(null, { status: 204 });
}
