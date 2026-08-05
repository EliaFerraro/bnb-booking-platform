import { z } from "zod";
import {
  ANALYTICS_EVENTS,
  DEVICE_TYPES,
  MAX_VIEW_DURATION_MS,
} from "@/configuration/analytics";

/**
 * What the browser is allowed to send.
 *
 * Every schema here is `.strict()` and tightly bounded. This is an unauthenticated
 * public endpoint that writes to the database, so the schema is the only thing
 * standing between it and someone using the site's own analytics table as free
 * storage. Nothing identifying is accepted at all: the visitor hash and the
 * country are computed on the server from request headers, never taken from the
 * body, because a value the client can choose is worthless as a measurement and
 * dangerous as a record.
 */

/** Paths are our own routes; the bound is generous but finite. */
const path = z.string().min(1).max(200);
const locale = z.string().min(2).max(5);

export const pageViewPayloadSchema = z
  .object({
    type: z.literal("pageview"),
    /**
     * Generated in the browser and held in memory for the life of the page, so
     * that the closing beacon can name the view it is closing. Never persisted
     * on the device — see configuration/analytics.ts.
     */
    id: z.uuid(),
    path,
    locale,
    /**
     * Host only. The client strips it before sending, and this refuses anything
     * that looks like a full URL: the path of a referring page can reveal far
     * more than the site it came from.
     */
    referrerHost: z
      .string()
      .max(120)
      .regex(/^[a-z0-9.-]+$/i, "host only")
      .optional(),
    device: z.enum(DEVICE_TYPES).optional(),
  })
  .strict();

export const durationPayloadSchema = z
  .object({
    type: z.literal("duration"),
    id: z.uuid(),
    // Clamped rather than merely validated: a tab left open overnight is not a
    // thirty-hour page view, and letting one through would quietly ruin every
    // average computed from this column.
    ms: z.number().int().min(0).max(MAX_VIEW_DURATION_MS),
  })
  .strict();

export const eventPayloadSchema = z
  .object({
    type: z.literal("event"),
    // A closed list, so the endpoint cannot be used to invent metrics or to
    // write arbitrary strings into the table.
    name: z.enum(ANALYTICS_EVENTS),
    path,
    locale,
    value: z.number().int().min(0).max(2_147_483_647).optional(),
  })
  .strict();

export const analyticsPayloadSchema = z.discriminatedUnion("type", [
  pageViewPayloadSchema,
  durationPayloadSchema,
  eventPayloadSchema,
]);

export type AnalyticsPayload = z.infer<typeof analyticsPayloadSchema>;
export type PageViewPayload = z.infer<typeof pageViewPayloadSchema>;
export type DurationPayload = z.infer<typeof durationPayloadSchema>;
export type EventPayload = z.infer<typeof eventPayloadSchema>;
