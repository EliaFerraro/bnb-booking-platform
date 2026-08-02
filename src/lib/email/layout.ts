import { MAIL_COLORS as C, MAIL_FONTS as F, MAIL_WIDTH } from "./theme";

/**
 * One document description, two renderings: `renderHtml` and `renderText`.
 *
 * Every message is sent as multipart/alternative, and the two parts have to say
 * the same thing — a plain-text part that has drifted from the HTML one is both
 * a support problem and a spam signal. Describing the mail once and rendering
 * it twice makes divergence impossible.
 */

export interface MailRow {
  label: string;
  value: string;
  /** Turns the value into a link (mailto:, tel:, https:). */
  href?: string;
}

export interface MailButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

export interface MailDocument {
  /** BCP 47 tag for the <html lang> attribute. */
  lang: string;
  brandName: string;
  /** Small line under the wordmark. Kept locale-neutral (a place, not prose). */
  brandKicker: string;
  /** Hidden line the inbox shows next to the subject in the message list. */
  preheader: string;
  /** Small capitalised label above the heading: what kind of mail this is. */
  eyebrow: string;
  heading: string;
  intro?: string[];
  rowsTitle?: string;
  rows?: MailRow[];
  quote?: { label: string; text: string };
  /** Paragraph immediately above the buttons. */
  note?: string;
  buttons?: MailButton[];
  /** Paragraph immediately below the buttons. */
  closing?: string;
  /** Sign-off, newline separated. */
  signOff?: string;
  /** Identity and legal lines closing the card. */
  footerLines: string[];
  /** Why this message was received. Its absence is a classic spam marker. */
  footerNote?: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const paragraphBreaks = (value: string) =>
  escapeHtml(value).replace(/\r?\n/g, "<br />");

const cell = (styles: string) => `style="${styles}"`;

const bodyType = `font-family:${F.sans};font-size:16px;line-height:1.65;color:${C.text};`;
const labelType = `font-family:${F.sans};font-size:11px;line-height:1.4;letter-spacing:1.2px;text-transform:uppercase;color:${C.muted};`;

function renderRows(rows: MailRow[]) {
  const cells = rows
    .map((row, index) => {
      const border =
        index === rows.length - 1 ? "" : `border-bottom:1px solid ${C.hairline};`;
      const value = row.href
        ? `<a href="${escapeHtml(row.href)}" style="color:${C.band};text-decoration:none;">${escapeHtml(row.value)}</a>`
        : escapeHtml(row.value);

      return `
              <tr>
                <td ${cell(`padding:11px 12px 11px 0;${border}${labelType}white-space:nowrap;vertical-align:top;`)}>${escapeHtml(row.label)}</td>
                <td ${cell(`padding:11px 0;${border}font-family:${F.sans};font-size:15px;line-height:1.5;color:${C.heading};vertical-align:top;word-break:break-word;`)}>${value}</td>
              </tr>`;
    })
    .join("");

  return `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${cell("width:100%;border-collapse:collapse;")}>
              <tbody>${cells}
              </tbody>
            </table>`;
}

function renderButtons(buttons: MailButton[]) {
  const items = buttons
    .map((button) => {
      const primary = button.variant !== "secondary";
      const background = primary ? C.band : C.card;
      const color = primary ? C.bandText : C.heading;
      const border = primary
        ? `border:1px solid ${C.band};`
        : `border:1px solid ${C.accent};`;

      return `
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" ${cell("display:inline-block;margin:0 8px 10px 0;")}>
                <tbody>
                  <tr>
                    <td bgcolor="${background}" ${cell(`border-radius:8px;${border}`)}>
                      <a href="${escapeHtml(button.href)}" ${cell(`display:inline-block;padding:12px 22px;font-family:${F.sans};font-size:15px;font-weight:600;line-height:1;color:${color};text-decoration:none;border-radius:8px;`)}>${escapeHtml(button.label)}</a>
                    </td>
                  </tr>
                </tbody>
              </table>`;
    })
    .join("");

  return `<div ${cell("margin:4px 0 14px;")}>${items}
            </div>`;
}

export function renderHtml(doc: MailDocument): string {
  const intro = (doc.intro ?? [])
    .map(
      (text) =>
        `<p ${cell(`margin:0 0 16px;${bodyType}`)}>${paragraphBreaks(text)}</p>`
    )
    .join("");

  const rowsTitle = doc.rowsTitle
    ? `<p ${cell(`margin:26px 0 4px;${labelType}`)}>${escapeHtml(doc.rowsTitle)}</p>`
    : "";

  const rows = doc.rows?.length ? renderRows(doc.rows) : "";

  const quote = doc.quote
    ? `
            <p ${cell(`margin:26px 0 8px;${labelType}`)}>${escapeHtml(doc.quote.label)}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${cell("width:100%;")}>
              <tbody>
                <tr>
                  <td bgcolor="${C.accentSoft}" ${cell(`padding:16px 18px;border-left:3px solid ${C.accent};border-radius:0 6px 6px 0;font-family:${F.sans};font-size:15px;line-height:1.6;color:${C.text};word-break:break-word;`)}>${paragraphBreaks(doc.quote.text)}</td>
                </tr>
              </tbody>
            </table>`
    : "";

  const note = doc.note
    ? `<p ${cell(`margin:26px 0 16px;${bodyType}`)}>${paragraphBreaks(doc.note)}</p>`
    : "";

  const buttons = doc.buttons?.length ? renderButtons(doc.buttons) : "";

  const closing = doc.closing
    ? `<p ${cell(`margin:0 0 16px;${bodyType}`)}>${paragraphBreaks(doc.closing)}</p>`
    : "";

  const signOff = doc.signOff
    ? `<p ${cell(`margin:26px 0 0;font-family:${F.serif};font-size:17px;line-height:1.55;color:${C.heading};`)}>${paragraphBreaks(doc.signOff)}</p>`
    : "";

  const footerLines = doc.footerLines
    .map(
      (line, index) =>
        `<p ${cell(`margin:${index === 0 ? "0" : "2px"} 0 0;font-family:${F.sans};font-size:12px;line-height:1.6;color:${C.muted};`)}>${paragraphBreaks(line)}</p>`
    )
    .join("");

  const footerNote = doc.footerNote
    ? `<p ${cell(`margin:18px 0 0;font-family:${F.sans};font-size:11px;line-height:1.6;color:${C.muted};text-align:center;`)}>${paragraphBreaks(doc.footerNote)}</p>`
    : "";

  // The zero-width joiners stop Gmail from padding the preview line with the
  // first words of the body once the preheader itself runs out.
  const preheader = `
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.page};opacity:0;">${escapeHtml(doc.preheader)}
      ${"&#8204;&nbsp;".repeat(60)}
    </div>`;

  return `<!doctype html>
<html lang="${escapeHtml(doc.lang)}" dir="ltr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta http-equiv="x-ua-compatible" content="ie=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeHtml(doc.heading)}</title>
<style>
  /* Clients that support <style> get the mobile gutters; the rest keep the
     inline padding, which stays legible at 320px anyway. */
  @media only screen and (max-width:620px) {
    .mail-shell { width:100% !important; }
    .mail-pad { padding-left:24px !important; padding-right:24px !important; }
  }
  a { color:${C.band}; }
</style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:${C.page};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${cell(`width:100%;background-color:${C.page};`)}>
    <tbody>
      <tr>
        <td align="center" ${cell("padding:32px 12px 40px;")}>
          <table role="presentation" class="mail-shell" width="${MAIL_WIDTH}" cellpadding="0" cellspacing="0" border="0" ${cell(`width:${MAIL_WIDTH}px;max-width:${MAIL_WIDTH}px;border-collapse:collapse;`)}>
            <tbody>
              <tr>
                <td bgcolor="${C.band}" class="mail-pad" ${cell(`padding:30px 36px;border-radius:12px 12px 0 0;`)}>
                  <p ${cell(`margin:0;font-family:${F.serif};font-size:25px;line-height:1.25;letter-spacing:0.4px;color:${C.bandText};`)}>${escapeHtml(doc.brandName)}</p>
                  <p ${cell(`margin:7px 0 0;font-family:${F.sans};font-size:11px;line-height:1.4;letter-spacing:2.4px;text-transform:uppercase;color:${C.bandMuted};`)}>${escapeHtml(doc.brandKicker)}</p>
                </td>
              </tr>
              <tr>
                <td bgcolor="${C.card}" class="mail-pad" ${cell(`padding:36px 36px 30px;border-left:1px solid ${C.hairline};border-right:1px solid ${C.hairline};`)}>
                  <p ${cell(`margin:0 0 10px;${labelType}`)}>${escapeHtml(doc.eyebrow)}</p>
                  <h1 ${cell(`margin:0 0 20px;font-family:${F.serif};font-size:27px;line-height:1.3;font-weight:400;color:${C.heading};`)}>${escapeHtml(doc.heading)}</h1>
                  ${intro}${rowsTitle}${rows}${quote}${note}${buttons}${closing}${signOff}
                </td>
              </tr>
              <tr>
                <td bgcolor="${C.accentSoft}" class="mail-pad" ${cell(`padding:22px 36px 26px;border:1px solid ${C.hairline};border-top:0;border-radius:0 0 12px 12px;`)}>
                  ${footerLines}
                </td>
              </tr>
            </tbody>
          </table>
          ${footerNote}
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;
}

export function renderText(doc: MailDocument): string {
  const lines: (string | null)[] = [
    doc.brandName.toUpperCase(),
    doc.brandKicker,
    "",
    doc.heading,
    "",
    ...(doc.intro ?? []).flatMap((text) => [text, ""]),
  ];

  if (doc.rows?.length) {
    if (doc.rowsTitle) lines.push(`${doc.rowsTitle}`);
    const width = Math.max(...doc.rows.map((row) => row.label.length));
    for (const row of doc.rows) {
      lines.push(`${row.label.padEnd(width)}  ${row.value}`);
    }
    lines.push("");
  }

  if (doc.quote) {
    lines.push(`${doc.quote.label}:`, doc.quote.text, "");
  }

  if (doc.note) lines.push(doc.note, "");

  for (const button of doc.buttons ?? []) {
    lines.push(`${button.label}: ${button.href}`);
  }
  if (doc.buttons?.length) lines.push("");

  if (doc.closing) lines.push(doc.closing, "");
  if (doc.signOff) lines.push(doc.signOff, "");

  lines.push("—".repeat(24), ...doc.footerLines);
  if (doc.footerNote) lines.push("", doc.footerNote);

  return lines.filter((line) => line !== null).join("\n");
}
