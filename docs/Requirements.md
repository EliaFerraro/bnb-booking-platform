# Project Requirements

This document translates the User Personas and User Stories into formal technical requirements to guide the development of the platform.

**Status column.** Most of what follows is not built. The shipped product is a five-language brochure site with an enquiry form; the booking engine, the host dashboard and payments do not exist. Marking each requirement is the cheapest way to stop this document reading as a description of the current system.

- ✅ **shipped** — implemented and in use.
- ⚪ **planned** — agreed, not built.

## Functional Requirements (FR)

Functional requirements define the specific features and behaviors the system must provide for each user type.

### 1.1 Guest Module
| FRN | Title | Description | Status |
| --- | ----- | ----------- | ------ |
| FR-01 | Property Showcase | The system shall display detailed information about the structure, its geographical location, and check-in/check-out policies | ✅ |
| FR-02 | Categorized Media Gallery | The system shall allow users to browse images organized by area (e.g., Rooms, Common Spaces, Outdoors). | ✅ |
| FR-03 | Availability Search Engine | Users must be able to input dates and the number of guests to receive real-time feedback on room availability. | ⚪ |
| FR-04 | Booking Management | The system shall handle booking requests, including personal data collection, user notes, and automated price calculation | ⚪ |
| FR-05 | Integrated Payment Gateway | Support in-app payments in a single solution. Must handle 3D Secure failures and provide 'Save for later' recovery. | ⚪ |
| FR-06 | Automated Notification System | The system shall trigger automatic emails/notifications for booking confirmations, reminders, and a digital "Welcome Kit" (PDF or dedicated link).| ⚪ |
| FR-07 | Social Authentication | Integration with OAuth 2.0 (e.g., Google Login) for quick profile creation. **Explicitly not a prerequisite for FR-20**: sending an enquiry must never require an account. | ⚪ |
| FR-08 | Interactive Map | Display of the property's location via an embedded map. Because the embed is third-party, it must not load before consent — see NFR-10b. | ✅ |
| FR-09 | Multi-Language UI | The frontend must support multiple languages to cater to international guests. Five locales ship: IT, EN, DE, FR, ES. All guest-facing copy uses the informal register in every locale. | ✅ |
| FR-20 | Enquiry Capture | The system shall accept an enquiry (name, email, optional phone, dates, party size, message), email it to the host, acknowledge it to the guest in their own language, and **persist it durably**. Persistence must not be able to fail the submission, and an enquiry whose email delivery fails must remain recoverable. | ✅ |
| FR-21 | Anti-Abuse | The enquiry form shall resist automated submission without a third-party CAPTCHA: a honeypot field, a minimum fill time, and a rate limit of 3 accepted submissions per 10 minutes per client. The rate limit must fail open if its backing store is unavailable. | ✅ |

### 1.2 Host Module
| FRN | Title | Description | Status |
| --- | ----- | ----------- | ------ |
| FR-10 | Request Management Dashboard | An interface to view, approve, or decline pending booking requests. The `enquiries.status` column already exists to back its triage states. | ⚪ |
| FR-11 | Calendar Synchronization (Channel Manager) | iCal sync with a configurable refresh rate (max 15 min) and a Manual Conflict Resolver UI for the host. | ⚪ |
| FR-12 | Dynamic Pricing Tool | Tools to set differentiated prices based on seasonality, holidays, or number of occupants. | ⚪ |
| FR-13 | Stay Constraints | Ability to set "Minimum Stay" requirements that vary by specific date ranges (e.g., minimum 2 nights on weekends). | ⚪ |
| FR-14 | One-Click Quote Generator | A feature to generate a personalized "booking offer" link to be shared via WhatsApp or Email. | ⚪ |
| FR-15 | Room Content Management (CMS) | A panel to edit descriptions, amenities, and upload new photos for each room. | ⚪ |
| FR-16 | Financial & Booking Analytics | A dashboard showing monthly booking lists and revenue reports (actual vs. projected). | ⚪ |
| FR-17 | In-App Messaging | A communication module for the host to chat with guests regarding special requests or logistics. | ⚪ |
| FR-18 | Trust & SEO | Implementation of Schema.org 'Hotel' markup for Google Rich Snippets and a Review/Testimonial display module. | ⚪ |
| FR-19 | Concurrency Guard | A 'Double-Booking' mutex logic that temporarily locks a room for 10 minutes once a guest enters the checkout flow. | ⚪ |
| FR-22 | Site Usage Analytics | Aggregate usage measurement — country, pages viewed, time on page, interaction events, enquiry-funnel timings. Must be first-party and cookieless, with no persistent visitor identifier, so that it qualifies for the analytics exemption in NFR-10b and the figures are not skewed by opt-outs. Visitors are distinguished by a hash salted with a random secret that is destroyed after two days, making the identifier unrecoverable thereafter. | ✅ |

## Non-Functional Requirements (NFR)

Non-functional requirements define the system's quality attributes and technical constraints.

### 2.1 Performance and Usability
| FRN | Title | Description | Status |
| --- | ----- | ----------- | ------ |
| NFR-01 | Mobile-First Design | The platform must be fully responsive, ensuring a seamless experience on smartphones (critical for "on-the-fly" travelers). | ✅ |
| NFR-02 | Loading Speed | The landing page must load in under 2 seconds (on 4G networks) to minimize user bounce rates. | ✅ |
| NFR-03 | UI Simplicity (Host-centric) | The admin area must be optimized for non-tech-native users, featuring clear iconography and guided workflows. | ⚪ |
| NFR-04 | Accessibility | Ensure compliance with WCAG 2.1 (Level AA) standards for font readability and navigation. | ⚪ |
| NFR-05 | Offline Capability | The 'Welcome Kit' and booking confirmation must be available via Service Workers (PWA) for offline access. Only a web manifest exists today. | ⚪ |
| NFR-06 | Observability | System must log every state change in a booking (Pending -> Paid -> Cancelled) for dispute resolution. Partially anticipated by `enquiries.email_*_status` and the `retention_runs` audit table. | ⚪ |
| NFR-07 | Host's Safe Mode | The Admin UI must prevent destructive actions without double-confirmation (e.g., deleting a booking). | ⚪ |
| NFR-12 | Graceful Degradation | Losing an optional dependency must degrade the site, never break it. Specifically: with the database unreachable or unconfigured, the enquiry form must still validate, still send both emails and still report success to the guest. | ✅ |

### 2.2 Maintainability & Scalability
| FRN | Title | Description | Status |
| --- | ----- | ----------- | ------ |
| NFR-08 | Modern Tech Stack | Use of scalable architectures for future growth. Shipped: Next.js 16, React 19, TypeScript `strict`, PostgreSQL via Drizzle. | ✅ |
| NFR-09 | Technical Docs | The codebase must be documented for future handovers: an accurate `docs/`, a real setup guide in `src/README.md`, and a record of processing for the legal side. | ✅ |
| NFR-11 | Data Persistence | Automated backups of the database to prevent loss of calendar data or booking history. Note that for enquiries the host's mailbox is a second, independent copy. | ⚪ |

### 2.3 Data Protection & Compliance

`NFR-10` previously read, in full: *"System must include cookie consent, data encryption, and tools for users to request data deletion."* One line, no acceptance criteria, and the only privacy requirement in the entire document. Split into requirements that can actually be checked.

| FRN | Title | Description | Status |
| --- | ----- | ----------- | ------ |
| NFR-10a | Accurate Privacy Notice | A published privacy notice, in every supported locale, naming the controller, the categories of data, the legal basis for each purpose, every processor, the retention period and the data-subject rights. **It must describe what the code actually does**; any change to storage, retention or processors is a change to this text in the same commit. | ✅ |
| NFR-10b | Consent Before Third Parties | No third-party resource may be requested before the visitor has consented. The gate must be on the element itself, not on its visibility — a hidden iframe still fetches. Strictly-necessary first-party cookies are exempt, as is first-party cookieless analytics (FR-22). | ✅ |
| NFR-10c | Demonstrable Consent | Every consent decision — grant, refusal or withdrawal — is recorded with its timestamp, the categories offered and chosen, the policy version shown and the language it was read in. Withdrawal is a new record, never a mutation. Satisfies GDPR art. 7(1). | ✅ |
| NFR-10d | Easy Withdrawal | Withdrawing consent must be no harder than granting it: reachable from every page, effective immediately and without a page reload, with refusal presented no less prominently than acceptance. Satisfies art. 7(3). | ✅ |
| NFR-10e | Retention by Anonymisation | Personal data must have a finite, stated lifetime. At 24 months an enquiry's identifying fields are irreversibly cleared while its non-identifying fields are kept, so business statistics survive without personal data. Enforcement must be automatic, idempotent, and auditable. | ✅ |
| NFR-10f | Data Minimisation in Transit and at Rest | Visitor IP addresses must never be stored in a recoverable form; a salted one-way hash with the salt held outside the database is the maximum retained. Application logs must never contain enquiry contents. | ✅ |
| NFR-10g | Erasure on Request | A guest must be able to obtain access, rectification or erasure by writing to the published address, free of charge, within one month. | ✅ |
| NFR-10h | Terms of Use | Published conditions of use, in every supported locale, stating unambiguously that submitting the enquiry form is not a reservation and creates no obligation on either side. | ✅ |
| NFR-10i | Encryption | The site is served over HTTPS only; the database is encrypted in transit and at rest and is not publicly reachable. On a managed Postgres exposing a public REST API, Row Level Security must be enabled on every table holding personal data — see [Data Architecture §1.5](./Data%20Architecture.md). | ✅ |