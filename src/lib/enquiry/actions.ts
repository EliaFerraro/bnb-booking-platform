"use server";

import { headers } from "next/headers";
import { enquirySchema, firstIssuePerField } from "./schema";
import type { EnquiryState } from "./state";
import { acknowledgeGuest, notifyHost } from "./notifier";

/** A human needs at least a few seconds to fill this in; bots submit instantly. */
const MIN_FILL_MS = 3_000;
/** Guards against a stale or forged timestamp being replayed. */
const MAX_FILL_MS = 6 * 60 * 60 * 1_000;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX = 3;

/**
 * In-memory and therefore per-instance: it resets on redeploy and does not
 * coordinate across serverless instances. Adequate at this traffic level;
 * replace with a shared store when persistence lands.
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

async function clientKey() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
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
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
      return { status: "error", formError: "tooFast" };
    }
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

  if (isRateLimited(await clientKey())) {
    return { status: "error", formError: "rateLimited" };
  }

  const enquiry = parsed.data;

  try {
    // The host notification is the one that must not be lost.
    await notifyHost(enquiry);
  } catch (error) {
    console.error("[enquiry] host notification failed", error);
    return { status: "error", formError: "sendFailed" };
  }

  try {
    await acknowledgeGuest(enquiry);
  } catch (error) {
    // The enquiry is already safely in the host's inbox, so a failed
    // acknowledgement must not be reported to the guest as a failure.
    console.error("[enquiry] guest acknowledgement failed", error);
  }

  return { status: "success", email: enquiry.email };
}
