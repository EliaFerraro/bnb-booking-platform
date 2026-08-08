import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  LegalDefinition,
  LegalList,
  LegalListItem,
  LegalPage,
  LegalSection,
} from "../_components/LegalPage";
import { ADDRESS_LINE, CIN, EMAIL, PHONE_DISPLAY } from "@/configuration/contact";
import { LEGAL_UPDATED_AT, RETENTION_MONTHS } from "@/configuration/privacy";
import { STRUCTURE_NAME } from "@/configuration/site";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({ locale, page: "privacy" });
}

/** What we collect, keyed rather than an array so translators cannot change the count. */
const DATA_KEYS = ["identity", "stay", "message", "technical"] as const;

/** Recipients. Each is a real processor with a real reason to exist. */
const RECIPIENT_KEYS = ["hosting", "email", "database", "maps"] as const;

const RIGHT_KEYS = [
  "access",
  "rectification",
  "erasure",
  "restriction",
  "portability",
  "objection",
] as const;

function PrivacyContent({ locale }: { locale: string }) {
  const t = useTranslations("pages.privacy");

  return (
    <LegalPage
      eyebrow={t("hero.eyebrow")}
      title={t("hero.title")}
      updated={t("hero.updated", { date: LEGAL_UPDATED_AT })}
      intro={t("intro")}
    >
      <LegalSection title={t("sections.controller.title")}>
        <p>{t("sections.controller.body", { brand: STRUCTURE_NAME })}</p>
        <dl className="flex flex-col gap-3 mt-2">
          <LegalDefinition term={t("sections.controller.labels.address")}>
            {ADDRESS_LINE}
          </LegalDefinition>
          <LegalDefinition term={t("sections.controller.labels.email")}>
            <a
              href={`mailto:${EMAIL}`}
              className="underline underline-offset-4 hover:text-primary-500 transition-colors"
            >
              {EMAIL}
            </a>
          </LegalDefinition>
          <LegalDefinition term={t("sections.controller.labels.phone")}>
            {PHONE_DISPLAY}
          </LegalDefinition>
          <LegalDefinition term={t("sections.controller.labels.cin")}>
            {CIN}
          </LegalDefinition>
        </dl>
        <p className="text-sm text-neutral-500">
          {t("sections.controller.noDpo")}
        </p>
      </LegalSection>

      <LegalSection title={t("sections.data.title")}>
        <p>{t("sections.data.body")}</p>
        <LegalList>
          {DATA_KEYS.map((key) => (
            <LegalListItem key={key}>
              <strong className="font-medium text-neutral-900">
                {t(`sections.data.items.${key}.label`)}
              </strong>{" "}
              — {t(`sections.data.items.${key}.text`)}
            </LegalListItem>
          ))}
        </LegalList>
        <p>{t("sections.data.noSpecialCategories")}</p>
      </LegalSection>

      <LegalSection title={t("sections.purposes.title")}>
        <LegalList>
          <LegalListItem>{t("sections.purposes.items.reply")}</LegalListItem>
          <LegalListItem>{t("sections.purposes.items.abuse")}</LegalListItem>
          <LegalListItem>{t("sections.purposes.items.consent")}</LegalListItem>
        </LegalList>
        <p>{t("sections.purposes.noObligation")}</p>
      </LegalSection>

      <LegalSection title={t("sections.storage.title")}>
        <p>{t("sections.storage.body")}</p>
        <p>{t("sections.storage.location")}</p>
      </LegalSection>

      <LegalSection title={t("sections.recipients.title")}>
        <p>{t("sections.recipients.body")}</p>
        <LegalList>
          {RECIPIENT_KEYS.map((key) => (
            <LegalListItem key={key}>
              <strong className="font-medium text-neutral-900">
                {t(`sections.recipients.items.${key}.label`)}
              </strong>{" "}
              — {t(`sections.recipients.items.${key}.text`)}
            </LegalListItem>
          ))}
        </LegalList>
        <p>{t("sections.recipients.noSale")}</p>
      </LegalSection>

      <LegalSection title={t("sections.analytics.title")}>
        <p>{t("sections.analytics.body")}</p>
        <LegalList>
          <LegalListItem>{t("sections.analytics.items.what")}</LegalListItem>
          <LegalListItem>{t("sections.analytics.items.noStorage")}</LegalListItem>
          <LegalListItem>{t("sections.analytics.items.visitor")}</LegalListItem>
          <LegalListItem>{t("sections.analytics.items.country")}</LegalListItem>
        </LegalList>
        <p>{t("sections.analytics.basis")}</p>
      </LegalSection>

      <LegalSection title={t("sections.retention.title")}>
        <p>{t("sections.retention.body", { months: RETENTION_MONTHS })}</p>
        <p>{t("sections.retention.anonymisation")}</p>
        <p>{t("sections.retention.mailbox")}</p>
      </LegalSection>

      <LegalSection title={t("sections.rights.title")}>
        <p>{t("sections.rights.body")}</p>
        <LegalList>
          {RIGHT_KEYS.map((key) => (
            <LegalListItem key={key}>
              {t(`sections.rights.items.${key}`)}
            </LegalListItem>
          ))}
        </LegalList>
        <p>{t("sections.rights.how", { email: EMAIL })}</p>
        <p>{t("sections.rights.complaint")}</p>
      </LegalSection>

      <LegalSection title={t("sections.security.title")}>
        <p>{t("sections.security.body")}</p>
      </LegalSection>

      <LegalSection title={t("sections.cookies.title")}>
        <p>
          {t("sections.cookies.body")}{" "}
          <Link
            href={`/${locale}/cookie-policy`}
            className="underline underline-offset-4 hover:text-primary-500 transition-colors"
          >
            {t("sections.cookies.link")}
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title={t("sections.changes.title")}>
        <p>{t("sections.changes.body")}</p>
      </LegalSection>
    </LegalPage>
  );
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent locale={locale} />;
}
