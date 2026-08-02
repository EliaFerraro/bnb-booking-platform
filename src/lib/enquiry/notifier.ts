import { buildGuestAcknowledgementMail } from "@/lib/email/templates/enquiry-guest";
import { buildHostEnquiryMail } from "@/lib/email/templates/enquiry-host";
import { sendMail } from "@/lib/email/transport";
import type { EnquiryInput } from "./schema";

/**
 * Composition only: what each message says lives in `lib/email/templates`, and
 * how it leaves the building lives in `lib/email/transport`.
 */

export async function notifyHost(enquiry: EnquiryInput) {
  await sendMail(buildHostEnquiryMail(enquiry));
}

export async function acknowledgeGuest(enquiry: EnquiryInput) {
  await sendMail(await buildGuestAcknowledgementMail(enquiry));
}
