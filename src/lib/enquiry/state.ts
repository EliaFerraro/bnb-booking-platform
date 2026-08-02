import type { EnquiryFieldErrors } from "./schema";

/**
 * Kept out of `actions.ts` because every export of a "use server" module must
 * be an async function.
 */
export type EnquiryState =
  | { status: "idle" }
  | { status: "success"; email: string }
  | {
      status: "error";
      /** Translation key under `pages.contact.form.errors`. */
      formError?: string;
      fieldErrors?: EnquiryFieldErrors;
    };

export const initialEnquiryState: EnquiryState = { status: "idle" };
