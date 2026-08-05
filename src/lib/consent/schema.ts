import { z } from "zod";
import { CONSENT_CATEGORIES } from "@/configuration/privacy";

/**
 * The shapes consent travels in: the cookie held on the visitor's device, and
 * the body posted to /api/consent for the audit log.
 */

export const CONSENT_ACTIONS = [
  "accept_all",
  "reject_all",
  "custom",
  "withdraw",
] as const;

export type ConsentActionValue = (typeof CONSENT_ACTIONS)[number];

/** Every category maps to a boolean; "necessary" is always true. */
export const consentChoicesSchema = z.object(
  Object.fromEntries(
    CONSENT_CATEGORIES.map((category) => [category, z.boolean()])
  ) as Record<(typeof CONSENT_CATEGORIES)[number], z.ZodBoolean>
);

export type ConsentChoices = z.infer<typeof consentChoicesSchema>;

/**
 * Kept deliberately terse — it lives in a cookie that is sent on every request,
 * so the field names are one character each: v(ersion), i(d), c(hoices),
 * t(imestamp).
 */
export const consentCookieSchema = z.object({
  v: z.string().min(1).max(32),
  i: z.uuid(),
  c: consentChoicesSchema,
  t: z.number().int().positive(),
});

export type ConsentCookieValue = z.infer<typeof consentCookieSchema>;

/**
 * The POST body. `.strict()` matters: this endpoint writes into a jsonb column,
 * and without it a caller could stuff arbitrary keys into the audit log. The
 * IP and user agent are deliberately absent — the server reads those from the
 * request headers and never trusts a client-supplied value.
 */
export const consentPayloadSchema = z
  .object({
    consentId: z.uuid(),
    action: z.enum(CONSENT_ACTIONS),
    categories: consentChoicesSchema,
    policyVersion: z.string().min(1).max(32),
    locale: z.string().min(2).max(5),
  })
  .strict();

export type ConsentPayload = z.infer<typeof consentPayloadSchema>;
