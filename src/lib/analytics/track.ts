"use client";

import type { AnalyticsEvent } from "@/configuration/analytics";

/**
 * The browser half of measurement. Two functions, both fire-and-forget.
 *
 * Nothing here reads or writes the visitor's device: no cookie, no
 * localStorage, no sessionStorage. The only identifier that exists client-side
 * is a page-view id held in a variable for the life of the page, which is why
 * this needs no consent — ePrivacy art. 5(3) is about terminal storage, and
 * there is none.
 */

/**
 * `sendBeacon` where it exists, because it survives the page being closed —
 * which is exactly when the most interesting beacon fires. It sends
 * `text/plain` rather than JSON to stay a CORS-simple request, and the route
 * parses the body itself rather than trusting a content type.
 *
 * The fetch fallback is for the rare browser without it, with `keepalive` for
 * the same reason.
 */
export function send(payload: object): void {
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", body);
      return;
    }

    void fetch("/api/analytics", {
      method: "POST",
      body,
      keepalive: true,
      headers: { "content-type": "text/plain" },
      // The catch is not optional: an offline visitor would otherwise get an
      // unhandled rejection in the console for a request nobody is waiting on.
    }).catch(() => {});
  } catch {
    // Measurement must never be able to break the page it is measuring.
  }
}

/**
 * Records a named interaction.
 *
 * `value` carries a single number where one is meaningful — how long the
 * enquiry form took, for instance. There is deliberately no free-form payload:
 * this table should never become somewhere details about a visitor accumulate
 * because it was convenient.
 */
export function trackEvent(
  name: AnalyticsEvent,
  options?: { value?: number }
): void {
  if (typeof window === "undefined") return;

  send({
    type: "event",
    name,
    path: window.location.pathname,
    locale: document.documentElement.lang || "it",
    ...(options?.value !== undefined
      ? { value: Math.max(0, Math.round(options.value)) }
      : {}),
  });
}
