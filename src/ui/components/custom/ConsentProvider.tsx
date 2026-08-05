"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useLocale } from "next-intl";
import {
  CONSENT_POLICY_VERSION,
  type ConsentCategory,
} from "@/configuration/privacy";
import {
  ALL_GRANTED,
  NECESSARY_ONLY,
  buildConsentCookie,
  readConsentCookie,
  serialiseConsentCookie,
} from "@/lib/consent/cookie";
import type {
  ConsentActionValue,
  ConsentChoices,
  ConsentCookieValue,
} from "@/lib/consent/schema";

/**
 * Holds the visitor's cookie choice and makes it available to anything that has
 * to react to it — today the map, tomorrow whatever else gets embedded.
 *
 * The cookie is the source of truth rather than React state, so a decision made
 * in one tab is picked up by another and the value survives a reload without a
 * hydration mismatch. `useSyncExternalStore` is what makes that safe: it takes a
 * separate server snapshot, so the server always renders "no consent" (the
 * conservative default) and the client corrects it during hydration.
 */

interface ConsentContextValue {
  /** Null until a decision has been made against the current policy version. */
  consent: ConsentCookieValue | null;
  hasConsent: (category: ConsentCategory) => boolean;
  /** Grants exactly one category, leaving the others as they are. */
  grant: (category: ConsentCategory) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (choices: ConsentChoices) => void;
  withdraw: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

// A module-level subscriber list: document.cookie fires no events, so every
// write notifies the store explicitly.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab may have decided in the meantime; re-reading on focus keeps
  // the two windows consistent without polling.
  window.addEventListener("focus", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("focus", listener);
  };
}

function notify() {
  for (const listener of listeners) listener();
}

// useSyncExternalStore compares snapshots by identity, so the parsed object has
// to be cached: parsing afresh on every call would return a new object each
// time and spin React into an infinite re-render.
let cachedRaw: string | null = null;
let cachedValue: ConsentCookieValue | null = null;

function getClientSnapshot(): ConsentCookieValue | null {
  const raw = document.cookie;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = readConsentCookie(raw);
  }
  return cachedValue;
}

/** The server cannot know the choice, and guessing wrong would load Google. */
function getServerSnapshot(): ConsentCookieValue | null {
  return null;
}

function writeCookie(value: ConsentCookieValue) {
  document.cookie = serialiseConsentCookie(value);
  notify();
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();

  const consent = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const commit = useCallback(
    (choices: ConsentChoices, action: ConsentActionValue, previousId?: string) => {
      // The id is generated client-side and is therefore forgeable. That is
      // fine: this identifies a *decision trail*, not a person, and nothing is
      // authorised on the strength of it. Reusing the previous id is what links
      // a withdrawal to the consent it revokes.
      const id = previousId ?? crypto.randomUUID();
      writeCookie(buildConsentCookie(choices, id));

      // Fire and forget. The UI has already updated from the cookie write
      // above, so the audit log is never on the critical path — it works
      // offline and it works if the API is down. `keepalive` lets the request
      // finish even if the visitor navigates away in the same tick, and the
      // empty catch is mandatory or an offline visitor gets an unhandled
      // rejection in the console.
      void fetch("/api/consent", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          consentId: id,
          action,
          categories: choices,
          policyVersion: CONSENT_POLICY_VERSION,
          locale,
        }),
      }).catch(() => {});
    },
    [locale]
  );

  const value = useMemo<ConsentContextValue>(() => {
    const currentId = consent?.i;

    return {
      consent,
      hasConsent: (category) => consent?.c[category] === true,
      grant: (category) =>
        commit(
          { ...(consent?.c ?? NECESSARY_ONLY), [category]: true },
          "custom",
          currentId
        ),
      acceptAll: () => commit(ALL_GRANTED, "accept_all", currentId),
      rejectAll: () => commit(NECESSARY_ONLY, "reject_all", currentId),
      save: (choices) => commit(choices, "custom", currentId),
      withdraw: () => commit(NECESSARY_ONLY, "withdraw", currentId),
    };
  }, [consent, commit]);

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used inside <ConsentProvider>.");
  }
  return context;
}
