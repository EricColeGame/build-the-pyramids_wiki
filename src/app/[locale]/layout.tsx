import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://build-the-pyramids.wiki";

// og:locale 必须是 language_TERRITORY 格式，直接写 "en" 会被社交平台判为无效值而回退到默认语言
const OG_LOCALES: Record<string, string> = { en: "en_US", es: "es_ES", pt: "pt_BR", de: "de_DE", fr: "fr_FR" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const image = `${siteUrl}/images/hero.webp`;
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "Build the Pyramids Wiki - Codes, Guides & Tips", template: "%s" },
    description: "Build the Pyramids Wiki provides Roblox guides, pyramid building tips, gameplay strategies, updates, and resources to help players master the ancient simulator.",
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    keywords: ["Build the Pyramids", "Roblox", "pyramid simulator", "building game", "construction", "wiki", "codes", "guides"],
    openGraph: { type: "website", locale: OG_LOCALES[locale] ?? locale, url: `${siteUrl}/${locale}`, siteName: siteConfig.name, images: [{ url: image, width: 1023, height: 576, alt: siteConfig.name }] },
    twitter: { card: "summary_large_image", images: [image] },
    ...(adsenseId ? { other: { "google-adsense-account": adsenseId } } : {}),
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages({ locale });
  const socialLinks = [siteConfig.social?.discord, siteConfig.social?.youtube, siteConfig.social?.twitter, siteConfig.social?.tiktok].filter((link): link is string => Boolean(link));
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteUrl,
    description: siteConfig.description,
    logo: { "@type": "ImageObject", url: `${siteUrl}/android-chrome-512x512.png`, width: 512, height: 512 },
    image: `${siteUrl}/images/hero.webp`,
    ...(socialLinks.length > 0 ? { sameAs: socialLinks } : {}),
  };

  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <html lang={locale} className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {adsenseId && (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          />
        )}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <JsonLd data={organization} />
            <SiteHeader locale={locale} />
            {children}
            <SiteFooter locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
