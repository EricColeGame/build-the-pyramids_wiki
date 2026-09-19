import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/legal-page";
import { languageAlternates, type Locale } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://build-the-pyramids.wiki";
const PATHNAME = "/privacy-policy";
const NAMESPACE = "legal.privacyPolicy";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NAMESPACE });
  const title = `${t("title")} | ${siteConfig.name}`;
  const description = t("description");
  return {
    title,
    description,
    alternates: { canonical: `/${locale}${PATHNAME}`, languages: languageAlternates(PATHNAME) },
    openGraph: { title, description, url: `${siteUrl}/${locale}${PATHNAME}` },
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NAMESPACE });
  return (
    <LegalPage title={t("title")}>
      {(t.raw("paragraphs") as string[]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </LegalPage>
  );
}
