import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  LegalList,
  LegalListItem,
  LegalPage,
  LegalSection,
} from "../_components/LegalPage";
import { CookiePreferencesLink } from "@/ui/components/custom/CookiePreferencesLink";
import { CONSENT_COOKIE, LEGAL_UPDATED_AT } from "@/configuration/privacy";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({ locale, page: "cookiePolicy" });
}

/**
 * The full inventory, and the reason this page exists: a cookie policy that
 * does not name every cookie is decoration. `name` is the literal string a
 * visitor will find in their browser's storage inspector, so it is written here
 * rather than translated.
 */
const TECHNICAL_COOKIES = [
  { key: "locale", name: "NEXT_LOCALE" },
  { key: "localeStorage", name: "user-preferred-language" },
  { key: "consent", name: CONSENT_COOKIE },
] as const;

const THIRD_PARTY_COOKIES = [
  { key: "maps", name: "NID, CONSENT, SOCS" },
] as const;

function CookieRow({
  name,
  purpose,
  duration,
  type,
  labels,
}: {
  name: string;
  purpose: string;
  duration: string;
  type: string;
  labels: { purpose: string; duration: string; type: string };
}) {
  return (
    <div className="flex flex-col gap-2 border border-neutral-200 bg-white/60 p-5">
      <code className="font-mono text-xs tracking-wide text-primary-500 break-all">
        {name}
      </code>
      <dl className="flex flex-col gap-1.5 text-sm">
        <div className="flex gap-2">
          <dt className="text-xs tracking-[0.1em] uppercase text-secondary-600 font-semibold shrink-0 w-20 pt-0.5">
            {labels.purpose}
          </dt>
          <dd className="text-neutral-700">{purpose}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-xs tracking-[0.1em] uppercase text-secondary-600 font-semibold shrink-0 w-20 pt-0.5">
            {labels.duration}
          </dt>
          <dd className="text-neutral-700">{duration}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-xs tracking-[0.1em] uppercase text-secondary-600 font-semibold shrink-0 w-20 pt-0.5">
            {labels.type}
          </dt>
          <dd className="text-neutral-700">{type}</dd>
        </div>
      </dl>
    </div>
  );
}

function CookiePolicyContent({ locale }: { locale: string }) {
  const t = useTranslations("pages.cookiePolicy");

  const labels = {
    purpose: t("table.purpose"),
    duration: t("table.duration"),
    type: t("table.type"),
  };

  return (
    <LegalPage
      eyebrow={t("hero.eyebrow")}
      title={t("hero.title")}
      updated={t("hero.updated", { date: LEGAL_UPDATED_AT })}
      intro={t("intro")}
    >
      <LegalSection title={t("sections.what.title")}>
        <p>{t("sections.what.body")}</p>
        <p>{t("sections.what.categories")}</p>
      </LegalSection>

      <LegalSection title={t("sections.technical.title")}>
        <p>{t("sections.technical.body")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {TECHNICAL_COOKIES.map(({ key, name }) => (
            <CookieRow
              key={key}
              name={name}
              purpose={t(`sections.technical.items.${key}.purpose`)}
              duration={t(`sections.technical.items.${key}.duration`)}
              type={t(`sections.technical.items.${key}.type`)}
              labels={labels}
            />
          ))}
        </div>
        <p className="text-sm text-neutral-500">
          {t("sections.technical.serverNote")}
        </p>
      </LegalSection>

      <LegalSection title={t("sections.thirdParty.title")}>
        <p>{t("sections.thirdParty.body")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {THIRD_PARTY_COOKIES.map(({ key, name }) => (
            <CookieRow
              key={key}
              name={name}
              purpose={t(`sections.thirdParty.items.${key}.purpose`)}
              duration={t(`sections.thirdParty.items.${key}.duration`)}
              type={t(`sections.thirdParty.items.${key}.type`)}
              labels={labels}
            />
          ))}
        </div>
        <p>{t("sections.thirdParty.gate")}</p>
      </LegalSection>

      <LegalSection title={t("sections.analytics.title")}>
        <p>{t("sections.analytics.body")}</p>
        <LegalList>
          <LegalListItem>{t("sections.analytics.items.noCookie")}</LegalListItem>
          <LegalListItem>{t("sections.analytics.items.rotating")}</LegalListItem>
          <LegalListItem>{t("sections.analytics.items.firstParty")}</LegalListItem>
        </LegalList>
        <p>{t("sections.analytics.why")}</p>
      </LegalSection>

      <LegalSection title={t("sections.absent.title")}>
        <p>{t("sections.absent.body")}</p>
        <LegalList>
          <LegalListItem>{t("sections.absent.items.analytics")}</LegalListItem>
          <LegalListItem>{t("sections.absent.items.advertising")}</LegalListItem>
          <LegalListItem>{t("sections.absent.items.social")}</LegalListItem>
          <LegalListItem>{t("sections.absent.items.fonts")}</LegalListItem>
        </LegalList>
      </LegalSection>

      <LegalSection title={t("sections.manage.title")}>
        <p>{t("sections.manage.body")}</p>
        <p>
          <CookiePreferencesLink className="underline underline-offset-4 hover:text-primary-500 transition-colors cursor-pointer">
            {t("sections.manage.open")}
          </CookiePreferencesLink>
        </p>
        <p>{t("sections.manage.browser")}</p>
        <p>{t("sections.manage.consequence")}</p>
      </LegalSection>

      <LegalSection title={t("sections.more.title")}>
        <p>
          {t("sections.more.body")}{" "}
          <Link
            href={`/${locale}/privacy`}
            className="underline underline-offset-4 hover:text-primary-500 transition-colors"
          >
            {t("sections.more.link")}
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CookiePolicyContent locale={locale} />;
}
