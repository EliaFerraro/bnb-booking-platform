# Privacy & Data Processing

The internal record behind the published notices. Where [the privacy policy](../src/app/[locale]/privacy/page.tsx) explains processing to a guest, this explains it to whoever has to answer for it — an auditor, the Garante, a future maintainer, or the owner in three years trying to remember why a column exists.

GDPR art. 5(2) makes the controller responsible not merely for complying but for **being able to demonstrate** compliance. This document, plus the `consent_log` and `retention_runs` tables, is that demonstration. It is deliberately the artefact a commercial consent platform would have sold; producing it costs nothing but writing it down.

**Keep it current.** Any change to what is collected, why, where it goes or how long it stays is a change to this file, to the published notices in all five locales, and — where it affects third parties or purposes — to `CONSENT_POLICY_VERSION`. All in the same commit.

---

## 1 Controller

| | |
| :--- | :--- |
| **Controller** | Il Respiro del Borgo |
| **Address** | Via della Pace, 24 — 14030 Montemagno (AT), Italia |
| **Email** | ilrespirodelborgobnb@gmail.com |
| **Phone** | +39 339 7096 173 |
| **CIN** | IT005077C1SCRVTNU4 |
| **VAT number** | None, and correctly so. The property is run as a *non-entrepreneurial* activity (attività ricettiva non imprenditoriale), which carries no VAT registration under Italian law; income is declared as *redditi diversi*. The CIN is the identifier that matters here, and it is published in the footer of every page and of every outgoing email. |
| **Codice Fiscale** | Not published. The controller is a natural person, so their CF is itself personal data, and GDPR art. 13(1)(a) asks for the controller's *identity and contact details* — name, address, email, phone, all published — not a tax number. Disclosing it would be gratuitous. |
| **DPO** | None appointed. Not required: art. 37 triggers on large-scale or systematic processing, and neither applies to a two-star guest house handling a few hundred enquiries a year. |

Supervisory authority: **Garante per la protezione dei dati personali**, www.garanteprivacy.it.

---

## 2 Record of processing activities

Art. 30 exempts organisations under 250 employees except where processing is not occasional, involves special categories, or risks the rights of the data subject. Enquiry handling is regular rather than occasional, so the exemption is not safely available and the record is kept.

### 2.1 Enquiry handling

| | |
| :--- | :--- |
| **Purpose** | Reply to an enquiry and arrange a possible stay. |
| **Legal basis** | Art. 6(1)(b) — pre-contractual measures taken at the data subject's request. |
| **Data subjects** | Prospective guests who submit the contact form. |
| **Categories** | First and last name, email, phone (optional), requested dates (optional), party size (optional), free-text message, browsing language, source page. |
| **Special categories** | None. The notice asks guests not to include them; if one arrives in free text it is handled in the mailbox and not acted on. |
| **Recipients** | Google (delivery/storage of the email), Supabase (database), Vercel (hosting). See §3. |
| **Transfers outside the EEA** | None intended. All processors are configured to EU regions; Google Workspace/Gmail operates under EU Standard Contractual Clauses. |
| **Retention** | 24 months, then anonymisation (§4). The email copy follows the mailbox clock. |
| **Security** | HTTPS only; database encrypted in transit and at rest, not publicly reachable, RLS enabled; credentials in environment variables only. |

**Why it is stored twice.** The host's mailbox is the system of record; the database is a second copy. Before the database existed, a failed email meant the enquiry vanished with no trace of who had tried to reach the property. The database exists to make that recoverable, which is a benefit to the guest as much as to the host — and is why a database failure must never fail a submission.

### 2.2 Abuse prevention

| | |
| :--- | :--- |
| **Purpose** | Prevent automated and abusive submission of the contact form. |
| **Legal basis** | Art. 6(1)(f) — legitimate interest in keeping the only contact channel usable. |
| **Categories** | Salted SHA-256 hash of the IP address; user-agent string, truncated to 300 characters. |
| **Retention** | 24 months, cleared by the same anonymisation run. |

**Balancing test.** The interest is real: an unprotected public form is filled with spam within days, and the host would lose genuine enquiries in the noise. The impact on the visitor is minimal and deliberately kept so:

- The **IP address is never stored**. Only `sha256(ip + IP_HASH_SECRET)` is, and the secret lives in the environment, never in the database, so a leaked dump alone cannot yield addresses. The salt is not decorative — an unsalted hash of an IPv4 address is a 2³² search space and would be a reversible encoding, which a regulator would rightly treat as the address itself.
- IPv6 addresses are truncated to their `/64` prefix before hashing, dropping the per-device portion.
- The only operation ever performed is equality comparison inside a ten-minute window. Nothing is profiled, and no visitor is recognised across visits.
- Rotating `IP_HASH_SECRET` renders every stored hash permanently unmatchable — a one-command way to retire the data early.

The interest does not override the visitor's rights, and no less intrusive measure achieves the purpose: the honeypot and timing trap are already in place and are not sufficient alone.

*Note:* an IP address is personal data (CJEU, *Breyer*, C-582/14). This record treats it as such even though only a hash is retained.

### 2.3 Consent records

| | |
| :--- | :--- |
| **Purpose** | Demonstrate that consent was given, refused or withdrawn, and to what. |
| **Legal basis** | Art. 6(1)(c) — legal obligation, since art. 7(1) requires the controller to be able to demonstrate consent. |
| **Categories** | Randomly generated consent id, action taken, categories offered and chosen, policy version, language, IP hash, user agent. |
| **Retention** | 24 months. The identifying columns are cleared; the decision itself is kept, since a consent record with no timestamp or version proves nothing. |

The consent id is generated in the browser and is therefore forgeable. That is acceptable and intended: the record evidences *a decision*, it does not authenticate a person, and nothing is authorised on the strength of it.

### 2.4 Technical logs

Vercel retains platform request logs on its own schedule. Application logging is deliberately constrained: a failed enquiry insert logs the error, the locale and the source path — **never the enquiry**. Writing a guest's name and message into a hosting provider's log store would be undisclosed processing, on a retention schedule this project does not control, outside the anonymisation it promises.

### 2.5 Site usage statistics

| | |
| :--- | :--- |
| **Purpose** | Understand how the site is used: which pages are read, for how long, from where, and how far people get through the enquiry form. |
| **Legal basis** | Art. 6(1)(f) — legitimate interest in knowing whether the site works. |
| **Data subjects** | All visitors. |
| **Categories** | Page path, language, time on page, viewport band, referring host, country, named interactions, and a daily visitor hash. |
| **Recipients** | None. First-party only; the data never leaves our own database. |
| **Retention** | Salt: 2 days. Visitor hash: 30 days. The remaining, non-identifying columns: indefinite. |

**Why this is not behind the banner.** ePrivacy art. 5(3) governs *storing or reading information on terminal equipment*. This does neither — no cookie, no localStorage, no sessionStorage — so the consent question does not arise. Separately, the Garante's 2021 cookie guidelines exempt first-party analytics that produce aggregate statistics, are not shared with third parties, and reduce the identifying power of the data. All three hold.

**Balancing test.** The interest is ordinary and legitimate: a property that cannot tell which pages are read has no way to improve them. The impact on the visitor is engineered down to close to nothing:

- Nothing is written to the device, so no state follows anyone anywhere.
- The visitor hash is salted with a random secret that is **destroyed after two days**. Once it is gone the hash cannot be matched to an address by anyone — including us, holding the database and every environment secret. This is the substantive difference from a derived salt, which would stay reproducible forever.
- No cross-day linkage is possible even *before* deletion: the salt changes at midnight, so the same person is a different value tomorrow.
- The IP is never stored in any form here. Country comes from the platform's geo header.
- Events are a closed list and carry one integer at most, so the tables cannot accumulate incidental detail about a person.
- Nothing is profiled and no individual is ever the subject of a report.

An honest note on the direction of travel: making this consent-based would *reduce* the quality of the data without improving anyone's privacy, since most visitors decline and the remainder are unrepresentative. Designing it to need no consent was the privacy-protective choice as well as the useful one.

**Explicitly not used:** Google Analytics or any third-party equivalent. It would require consent, send data outside the EEA, and the Garante ruled against its use in 2022.

---

## 3 Processors and sub-processors

| Processor | Role | Data | Location | Basis |
| :--- | :--- | :--- | :--- | :--- |
| **Vercel Inc.** | Hosting, edge delivery, platform logs | Everything in transit; request metadata | EU regions; DPA with SCCs | Art. 28 DPA |
| **Google Ireland Ltd** (Gmail) | Delivers and stores enquiry emails | Full enquiry content | EU; SCCs for any onward transfer | Workspace terms |
| **Supabase Inc.** | Managed PostgreSQL | Enquiry rows, consent log | EU region — **must be selected at project creation and cannot be changed afterwards** | Art. 28 DPA |
| **Google Ireland Ltd** (Maps) | Map embed, **only after consent** | Visitor IP, user agent, Google cookies | Google infrastructure | Consent, art. 6(1)(a) |

Google Maps is the only one that is not a processor acting on instructions: once the visitor allows the embed, Google is an independent controller for what it collects. That is exactly why it is gated, and why the cookie policy says plainly that Google's own privacy policy governs from that point.

**Not used, and worth recording as a decision.** No Google Analytics (consent-requiring, and the Garante ruled against its use in 2022 over transfers to the United States). No advertising or remarketing tags. No social embeds. No third-party consent platform — the banner is first-party, so it adds no processor of its own. No CDN beyond the host. Google Fonts are downloaded at build time and self-served, so no runtime request reaches Google's servers, avoiding the exposure that produced the German Google Fonts case law.

---

## 4 Retention schedule

| Data | Clock | What happens |
| :--- | :--- | :--- |
| Enquiry — identifying fields | 24 months from submission | Irreversibly set to `NULL`; `anonymized_at` stamped |
| Enquiry — dates, party size, locale, source page, month | indefinite | Retained: no longer personal data (recital 26) |
| Consent record — IP hash, user agent | 24 months | Cleared |
| Consent record — decision, version, language | indefinite | Retained as evidence |
| Analytics — daily salt | **2 days** | Deleted; the day's hashes become permanently inert |
| Analytics — visitor hash | 30 days | Cleared |
| Analytics — path, country, locale, duration, device | indefinite | Retained: not personal data |
| Enquiry email in the mailbox | as long as the enquiry and any stay require | Manual |
| Tax records from a stay that happened | **10 years** | Statutory, art. 2220 Codice Civile — art. 6(1)(c), not deletable on request |
| `retention_runs` | indefinite | No personal data |

**Anonymisation rather than deletion, and why it is the honest answer.** Deleting a row would discard the only record of how a season went, for no gain in privacy. Clearing the identifying columns achieves the same protection — the remainder cannot be attributed to a person even with additional information — while leaving figures the business genuinely needs.

This is also the correct answer to *"but large companies keep data forever."* They do not keep *personal* data forever; they run different categories on different clocks and anonymise or aggregate the rest. A converted booking's invoice is kept ten years because the law requires it; an enquiry that never became anything is kept for far less.

**Enforcement.** `src/lib/retention/anonymise.ts`, run daily by `/api/cron/anonymise`. Idempotent (every statement filters on `anonymized_at IS NULL`), transactional, with the cutoff computed by the database rather than by application code. Every execution writes a `retention_runs` row — which is both the proof the policy is enforced and the only way a silently-stopped job becomes visible.

---

## 5 Cookie inventory

Reproduced in the published cookie policy in all five locales. **This table and that page must never disagree.**

| Name | Type | Purpose | Duration | Consent |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_LOCALE` | First-party cookie | The chosen interface language | 1 year | Not required — strictly necessary |
| `user-preferred-language` | First-party localStorage | The same preference, on the device | Until cleared | Not required |
| `ilrespirodelborgo_consent` | First-party cookie | The cookie decision itself | 180 days | Not required |
| `NID`, `CONSENT`, `SOCS` | Google, third-party | Set by the Maps embed | 6 months – 2 years, set by Google | **Required** |

Site usage statistics deliberately appear **nowhere** in this table, because they set nothing and read nothing on the device. That is the point of §2.5, and the cookie policy says so explicitly rather than leaving a reader to wonder how the figures are produced.

Two points the published page states explicitly, because an earlier version of it was wrong:

- `NEXT_LOCALE` **is** sent to the server on every request — that is how the site knows which language to answer in. The previous text claimed the preference "is not sent to anyone", which was false. It remains technical data and identifies no one.
- The 180-day lifetime of the consent cookie matches the Garante's expectation that a declined banner is not re-proposed for at least six months. The same lifetime is used for acceptance, so neither choice is privileged.

**Consent design decisions.**

- **Specificity is layered, not uniform.** Art. 4(11) requires consent to be specific and informed, but that does not require every surface to enumerate every vendor — it requires the information to be available at the point of decision. So: the **banner** speaks generically ("content and services provided by third parties"), the **category label** is generic ("External content"), the **category description in the preferences dialog names Google Maps explicitly** along with what it receives, the **in-context placeholder where the map would be** names Google again at the exact moment of choosing, and the **cookie policy** carries the full inventory. Generic wording at the top is deliberate and also future-proof: a second embed would not require re-consent under a label that already covers it.
- The banner offers *Accept all cookies* and *Technical only* as equally weighted buttons. A banner where refusing is harder than accepting does not collect valid consent, whatever its text says.
- Nothing third-party loads before a decision, so there is no pre-consent leakage to compensate for. The map is gated on the **element**, not on its visibility: a hidden `<iframe>` still fetches from Google.
- A visitor who declines still gets the address and an ordinary outbound link to Google Maps. Declining costs them nothing but the interactive frame.
- `CONSENT_POLICY_VERSION` invalidates stored decisions when bumped. Bump it when a third party is added or removed, a purpose changes, or retention changes — **not** for typos or new translations. Needless re-prompting trains people to click through without reading, which makes consent less valid, not more.

---

## 6 Data subject rights

Handled by the owner directly, at the published address, free of charge, within one month (extendable to three for complex requests, with notice).

| Right | Article | How it is satisfied |
| :--- | :--- | :--- |
| Access | 15 | Query `enquiries` by email; export the mailbox thread |
| Rectification | 16 | Direct update |
| Erasure | 17 | Delete the row and the mailbox thread. **Limit:** tax records from a completed stay are subject to art. 17(3)(b) and cannot be erased before ten years. |
| Restriction | 18 | Set `status = 'archived'` and stop processing |
| Portability | 20 | Export the row as JSON or CSV |
| Objection | 21 | Applies to the abuse-prevention processing (§2.2); on objection, clear the IP hash |
| Complaint | 77 | Garante, or the authority where the data subject lives |

There is no automated decision-making and no profiling, so art. 22 does not arise.

---

## 7 Breach procedure

A personal data breach affecting this system would most plausibly be a leaked `DATABASE_URL`, a compromised Gmail account, or RLS left disabled on a Supabase table.

1. Contain — rotate the exposed credential immediately; rotate `IP_HASH_SECRET` if the database was reached.
2. Assess scope — how many rows, which columns, over what period. `retention_runs` gives the anonymisation state at any date.
3. If a risk to rights and freedoms is likely, notify the Garante **within 72 hours** of becoming aware (art. 33).
4. If the risk is high, notify affected guests directly (art. 34).
5. Record the incident here regardless of whether notification was required — art. 33(5) requires documenting every breach, including those that were not notified.

Preventive measures already in place: the pre-commit hook refuses to commit any `.env*` file containing a filled-in credential or a connection string with an inline password; RLS is enabled in the migration itself rather than left to a dashboard setting.

---

## 8 Policy version history

Two constants, deliberately separate, both in `src/configuration/privacy.ts`:

- **`CONSENT_POLICY_VERSION`** — bumping it invalidates every stored consent and re-asks. Reserve it for changes that alter *what a visitor is consenting to*: a third party added or removed, a purpose that relies on consent changing, a retention period changing.
- **`LEGAL_UPDATED_AT`** — the date shown on the notices. Moves whenever the text changes materially.

They move independently because the notices change more often than consent needs re-asking, and needless re-prompting teaches people to dismiss banners without reading them — which makes consent less valid, not more.

Add a row below whenever either changes, and never edit a past row: the point is to be able to say what a given visitor was shown.

| Notice date | Consent version | Change |
| :--- | :--- | :--- |
| `2026-08-04` | `2026-08-04` | First published version of the current notices. Replaced a footer modal that stated enquiries were "not kept in any database" — true when written, false as of enquiry persistence, and corrected before the first row was ever written. Introduced: the enquiry database and its 24-month anonymisation, the IP-hash disclosure, the named processor list, consent gating for the Google Maps embed with a logged decision, and published terms of use. |
| `2026-08-05` | `2026-08-04` *(unchanged)* | Added first-party site usage statistics (§2.5) and corrected the cookie policy, which until this point stated there was no analytics of any kind. **Consent version deliberately not bumped**: the measurement stores nothing on the device and relies on legitimate interest, so re-prompting would have asked visitors again about the map for no reason. This is the worked example of why the two constants are separate. |
