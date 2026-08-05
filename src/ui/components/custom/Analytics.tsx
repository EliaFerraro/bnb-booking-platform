"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  ANALYTICS_EVENTS,
  DEVICE_BREAKPOINTS,
  MAX_VIEW_DURATION_MS,
  type AnalyticsEvent,
  type DeviceType,
} from "@/configuration/analytics";
import { send, trackEvent } from "@/lib/analytics/track";

/**
 * Records a page view on arrival and its duration on departure.
 *
 * Mounted once in the layout. It renders nothing and stores nothing on the
 * device — the id linking the two beacons lives in a ref for the life of the
 * page and is gone when the tab closes.
 */

function deviceType(): DeviceType {
  const width = window.innerWidth;
  if (width < DEVICE_BREAKPOINTS.mobile) return "mobile";
  if (width < DEVICE_BREAKPOINTS.tablet) return "tablet";
  return "desktop";
}

/**
 * The host of the referring page, and only the host. A full referrer URL can
 * carry a search query or a path that says considerably more about someone than
 * the site they arrived from.
 *
 * Internal navigation is dropped: arriving at page three from page two of the
 * same site is not a referral, and counting it would drown the figures that
 * matter.
 */
function referrerHost(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const { hostname } = new URL(document.referrer);
    return hostname === window.location.hostname ? undefined : hostname;
  } catch {
    return undefined;
  }
}

const TRACKABLE = new Set<string>(ANALYTICS_EVENTS);

/**
 * One delegated listener for every `data-track` element on the page.
 *
 * The alternative — an onClick on each link — would turn the footer, the
 * contact cards and every call to action into client components purely to
 * report a click. This keeps them server-rendered and puts the whole
 * click-tracking concern in one place, where it is also easy to see exactly
 * what is being collected.
 */
function useClickTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const name = target.closest("[data-track]")?.getAttribute("data-track");
      // Ignores anything not in the closed list, so a typo in a template
      // silently records nothing rather than inventing a metric.
      if (name && TRACKABLE.has(name)) trackEvent(name as AnalyticsEvent);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
}

export function Analytics() {
  const pathname = usePathname();
  const locale = useLocale();

  const viewId = useRef<string | null>(null);
  const startedAt = useRef<number>(0);

  useClickTracking();

  useEffect(() => {
    const id = crypto.randomUUID();
    viewId.current = id;
    startedAt.current = Date.now();

    send({
      type: "pageview",
      id,
      path: pathname,
      locale,
      referrerHost: referrerHost(),
      device: deviceType(),
    });

    // Sent at most once per view. Both triggers below can fire for the same
    // departure — a backgrounded tab that is then closed — and a duplicate
    // would be discarded server-side anyway, but not sending it is cheaper.
    let closed = false;
    const close = () => {
      if (closed || !viewId.current) return;
      closed = true;

      const ms = Math.min(Date.now() - startedAt.current, MAX_VIEW_DURATION_MS);
      send({ type: "duration", id: viewId.current, ms });
    };

    // `pagehide` rather than `beforeunload`: it fires on mobile Safari, which
    // `beforeunload` frequently does not, and it does not block the browser's
    // back-forward cache.
    window.addEventListener("pagehide", close);

    // Covers the tab being switched away from and never returned to — on
    // mobile that is how most visits actually end, with no unload at all.
    const onVisibility = () => {
      if (document.visibilityState === "hidden") close();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pagehide", close);
      document.removeEventListener("visibilitychange", onVisibility);
      // A client-side navigation unmounts this effect, which is the departure
      // from the previous page. Without this, every page but the last in a
      // visit would have no duration at all.
      close();
    };
  }, [pathname, locale]);

  return null;
}
