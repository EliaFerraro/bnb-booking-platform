import { timingSafeEqual } from "node:crypto";
import { cronSecret } from "@/lib/env";
import { runAnonymisation } from "@/lib/retention/anonymise";

/**
 * The scheduled half of the retention promise. Vercel Cron calls this once a
 * day with `Authorization: Bearer $CRON_SECRET`, which the platform attaches
 * automatically when that variable exists on the project.
 *
 * proxy.ts excludes /api both in its matcher and in its body, so no locale
 * redirect can interfere.
 */

// postgres.js opens raw TCP sockets, which the Edge runtime cannot do.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorised(request: Request): boolean {
  const secret = cronSecret();
  if (!secret) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;

  const provided = Buffer.from(header.slice("Bearer ".length));
  const expected = Buffer.from(secret);

  // timingSafeEqual throws rather than returning false on a length mismatch,
  // so the lengths have to be compared first. That comparison leaks only the
  // secret's length, which is not worth protecting.
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

export async function GET(request: Request) {
  // Unset secret means refuse, never allow. Failing open on an endpoint whose
  // whole job is to destroy data is how a database gets wiped by a crawler.
  if (!cronSecret()) {
    return new Response(null, { status: 503 });
  }

  // No body: a prober learns nothing about whether the route exists or the
  // secret was merely wrong.
  if (!isAuthorised(request)) {
    return new Response(null, { status: 401 });
  }

  const result = await runAnonymisation();

  if (!result) {
    return Response.json({ ok: false }, { status: 500 });
  }

  // Returned as JSON so the line in the cron log says what actually happened.
  return Response.json({ ok: true, ...result });
}
