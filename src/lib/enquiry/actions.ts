"use server";

import { after } from "next/server";
import {
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
} from "@/configuration/privacy";
import { clientIp, hashIp, userAgent } from "@/lib/privacy/ip";
import { enquirySchema, firstIssuePerField } from "./schema";
import {
  countRecentByIp,
  insertEnquiry,
  markEmailOutcome,
} from "./repository";
import type { EnquiryState } from "./state";
import { acknowledgeGuest, notifyHost } from "./notifier";

/** A human needs at least a few seconds to fill this in; bots submit instantly. */
const MIN_FILL_MS = 3_000;
/** Guards against a stale or forged timestamp being replayed. */
const MAX_FILL_MS = 6 * 60 * 60 * 1_000;

/**
 * The first of two rate-limit gates. In-memory and therefore per-instance: it
 * resets on redeploy and does not coordinate across serverless instances, so a
 * determined flood spread over fresh instances walks straight past it. It is
 * kept anyway because it costs nothing, adds no latency, and catches the
 * overwhelmingly common case of one bot hammering one warm instance. The
 * durable gate is the database count below.
 */
const submissions = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (submissions.get(key) ?? []).filter(
    (at) => now - at < RATE_LIMIT_WINDOW_MS
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(key, recent);
    return true;
  }

  recent.push(now);
  submissions.set(key, recent);
  return false;
}

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  // Honeypot: a real browser leaves this hidden field empty. Report success so
  // bots get no signal about why the submission went nowhere.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success", email: String(formData.get("email") ?? "") };
  }

  // `startedAt` is stamped by the client on mount. A missing or zero value
  // means JavaScript never ran, so the timing signal is simply unavailable —
  // the honeypot and the rate limit still apply.
  const startedAt = Number(formData.get("startedAt"));
  let fillDurationMs: number | null = null;

  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
      return { status: "error", formError: "tooFast" };
    }
    // Free to collect, since the anti-bot check already needs the timestamp,
    // and it answers the one question worth asking about a form this long:
    // how long does it actually take. Non-identifying, so it is kept after the
    // rest of the row is anonymised.
    fillDurationMs = elapsed;
  }

  const parsed = enquirySchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    arrival: formData.get("arrival"),
    departure: formData.get("departure"),
    guests: formData.get("guests"),
    message: formData.get("message"),
    locale: formData.get("locale"),
    sourcePath: formData.get("sourcePath"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: firstIssuePerField(parsed.error) };
  }

  const ip = await clientIp();
  const ipHash = hashIp(ip);

  if (isRateLimited(ip ?? "unknown")) {
    return { status: "error", formError: "rateLimited" };
  }

  // The durable gate. Only reached by submissions that already cleared the
  // honeypot, the timing trap, full validation and the in-memory limiter — in
  // practice a handful of real people a day, so the extra round trip is
  // invisible. A null answer means the database could not say, and that has to
  // count as "allow": see countRecentByIp.
  if (ipHash) {
    const recent = await countRecentByIp(ipHash);
    if (recent !== null && recent >= RATE_LIMIT_MAX) {
      return { status: "error", formError: "rateLimited" };
    }
  }

  const enquiry = parsed.data;

  // Stored before the emails are attempted, and deliberately so: this is the
  // single biggest reason the database exists. A notifyHost failure used to
  // mean the enquiry was gone for good; now the row survives with
  // email_host_status = 'failed' and the host can recover it. insertEnquiry
  // never throws, so a database problem cannot fail the submission.
  const enquiryId = await insertEnquiry(enquiry, {
    ipHash,
    userAgent: await userAgent(),
    fillDurationMs,
  });

  const recordOutcome = (host: "sent" | "failed", guest: "sent" | "failed") => {
    if (!enquiryId) return;
    // after() runs once the response has been flushed, so the guest's spinner
    // stops before this does. A floating promise would not do: on a serverless
    // platform the instance can be frozen the moment the response completes,
    // and the update would simply be lost.
    after(() => markEmailOutcome(enquiryId, host, guest));
  };

  try {
    // The host notification is the one that must not be lost.
    await notifyHost(enquiry);
  } catch (error) {
    console.error("[enquiry] host notification failed", error);
    recordOutcome("failed", "failed");
    return { status: "error", formError: "sendFailed" };
  }

  let guestStatus: "sent" | "failed" = "sent";
  try {
    await acknowledgeGuest(enquiry);
  } catch (error) {
    // The enquiry is already safely in the host's inbox, so a failed
    // acknowledgement must not be reported to the guest as a failure.
    console.error("[enquiry] guest acknowledgement failed", error);
    guestStatus = "failed";
  }

  recordOutcome("sent", guestStatus);

  return { status: "success", email: enquiry.email };
}
