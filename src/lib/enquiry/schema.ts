import { z } from "zod";

/**
 * Validation messages are stable dot-notation keys, not prose: the server never
 * needs to know the guest's language. The form resolves them against the
 * `pages.contact.form.errors` namespace.
 */
const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const enquirySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "name.tooShort" })
      .max(100, { error: "name.tooLong" }),

    email: z
      .email({ error: "email.invalid" })
      .max(200, { error: "email.tooLong" }),

    phone: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(40, { error: "phone.tooLong" }).optional()
    ),

    arrival: z.preprocess(
      emptyToUndefined,
      z.iso.date({ error: "arrival.invalid" }).optional()
    ),

    departure: z.preprocess(
      emptyToUndefined,
      z.iso.date({ error: "departure.invalid" }).optional()
    ),

    guests: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number({ error: "guests.invalid" })
        .int({ error: "guests.invalid" })
        .min(1, { error: "guests.invalid" })
        .max(20, { error: "guests.tooMany" })
        .optional()
    ),

    message: z
      .string()
      .trim()
      .min(10, { error: "message.tooShort" })
      .max(3000, { error: "message.tooLong" }),

    locale: z.string().trim().min(2).max(5),

    sourcePath: z.preprocess(
      emptyToUndefined,
      z.string().max(200).optional()
    ),
  })
  .superRefine((value, ctx) => {
    // ISO dates compare correctly as strings, so no Date parsing is needed.
    const today = new Date().toISOString().slice(0, 10);

    if (value.arrival && value.arrival < today) {
      ctx.addIssue({
        code: "custom",
        path: ["arrival"],
        message: "arrival.inPast",
      });
    }

    if (value.departure && !value.arrival) {
      ctx.addIssue({
        code: "custom",
        path: ["arrival"],
        message: "arrival.required",
      });
    }

    if (value.arrival && value.departure && value.departure <= value.arrival) {
      ctx.addIssue({
        code: "custom",
        path: ["departure"],
        message: "departure.notAfterArrival",
      });
    }
  });

/**
 * Deliberately shaped like a future `booking_request` row: when persistence and
 * the host backoffice land, this becomes the insert payload rather than being
 * redesigned.
 */
export type EnquiryInput = z.infer<typeof enquirySchema>;
