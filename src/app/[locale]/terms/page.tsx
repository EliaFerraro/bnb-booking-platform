import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  LegalList,
  LegalListItem,
  LegalPage,
  LegalSection,
} from "../_components/LegalPage";
import { ADDRESS_LINE, CIN, EMAIL } from "@/configuration/contact";
import { LEGAL_UPDATED_AT } from "@/configuration/privacy";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({ locale, page: "terms" });
}

function TermsContent({ locale }: { locale: string }) {
  const t = useTranslations("pages.terms");

  return (
    <LegalPage
      eyebrow={t("hero.eyebrow")}
      title={t("hero.title")}
      updated={t("hero.updated", { date: LEGAL_UPDATED_AT })}
      intro={t("intro")}
    >
      <LegalSection title={t("sections.scope.title")}>
        <p>{t("sections.scope.body")}</p>
        <p>{t("sections.scope.owner", { address: ADDRESS_LINE, cin: CIN })}</p>
      </LegalSection>

      {/*
        The single most important section on this page. The site has no booking
        engine and takes no payment: everything the form does is start a
        conversation. Saying so plainly protects both sides, and it is the
        clause a guest is most likely to have assumed otherwise.
      */}
      <LegalSection title={t("sections.notABooking.title")}>
        <p>{t("sections.notABooking.body")}</p>
        <LegalList>
          <LegalListItem>{t("sections.notABooking.items.noCommitment")}</LegalListItem>
          <LegalListItem>{t("sections.notABooking.items.noPayment")}</LegalListItem>
          <LegalListItem>{t("sections.notABooking.items.confirmation")}</LegalListItem>
        </LegalList>
        <p>{t("sections.notABooking.terms")}</p>
      </LegalSection>

      <LegalSection title={t("sections.use.title")}>
        <p>{t("sections.use.body")}</p>
        <LegalList>
          <LegalListItem>{t("sections.use.items.accurate")}</LegalListItem>
          <LegalListItem>{t("sections.use.items.lawful")}</LegalListItem>
          <LegalListItem>{t("sections.use.items.automated")}</LegalListItem>
        </LegalList>
      </LegalSection>

      <LegalSection title={t("sections.content.title")}>
        <p>{t("sections.content.body")}</p>
        <p>{t("sections.content.prices")}</p>
      </LegalSection>

      <LegalSection title={t("sections.intellectualProperty.title")}>
        <p>{t("sections.intellectualProperty.body")}</p>
      </LegalSection>

      <LegalSection title={t("sections.availability.title")}>
        <p>{t("sections.availability.body")}</p>
        <p>{t("sections.availability.links")}</p>
      </LegalSection>

      <LegalSection title={t("sections.liability.title")}>
        <p>{t("sections.liability.body")}</p>
        <p>{t("sections.liability.consumer")}</p>
      </LegalSection>

      <LegalSection title={t("sections.privacy.title")}>
        <p>
          {t("sections.privacy.body")}{" "}
          <Link
            href={`/${locale}/privacy`}
            className="underline underline-offset-4 hover:text-primary-500 transition-colors"
          >
            {t("sections.privacy.privacyLink")}
          </Link>{" "}
          {t("sections.privacy.and")}{" "}
          <Link
            href={`/${locale}/cookie-policy`}
            className="underline underline-offset-4 hover:text-primary-500 transition-colors"
          >
            {t("sections.privacy.cookieLink")}
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title={t("sections.law.title")}>
        <p>{t("sections.law.body")}</p>
        <p>{t("sections.law.odr")}</p>
      </LegalSection>

      <LegalSection title={t("sections.changes.title")}>
        <p>{t("sections.changes.body")}</p>
        <p>{t("sections.changes.contact", { email: EMAIL })}</p>
      </LegalSection>
    </LegalPage>
  );
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent locale={locale} />;
}
