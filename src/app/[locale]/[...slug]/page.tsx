import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Swords } from "lucide-react";
import { getMessages } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { getAllContent, getAllContentPaths, getContent, getDynamicNavigation, type ContentItem } from "@/lib/content";
import { Breadcrumbs, JsonLd, localizeHref } from "@/components/site";
import { AdBanner, DismissibleStickyBanner, NativeBannerAd } from "@/components/ads";
import { MobileTOC } from "@/components/table-of-contents";
import { CONTENT_TYPES } from "@/config/navigation";
import { languageAlternates, type Locale } from "@/i18n/routing";
import en from "@/locales/en.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://build-the-pyramids.wiki";
type Messages = typeof en;

/**
 * 分类的本地化标题：优先取 locale JSON 的 overviewTitle，缺失时回退 slug 转标题。
 * 供列表页 H1、面包屑与 JSON-LD 的 ItemList.name 共用——三处若各写一份，
 * 很容易只本地化其中一处，让英文 slug 泄漏进结构化数据与可见面包屑。
 */
function localizedSectionTitle(messages: Messages, contentType: string) {
  const fromMessages = (messages as unknown as Record<string, Record<string, string>>)[contentType]?.overviewTitle;
  return fromMessages || contentType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateStaticParams() {
  const paths = await getAllContentPaths("en");
  const listingPages = CONTENT_TYPES.map((ct) => ({ slug: [ct] }));
  return [...listingPages, ...paths.map((item) => ({ slug: [item.contentType, ...item.slug] }))];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string[] }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  if (slug.length === 1 && CONTENT_TYPES.includes(slug[0])) {
    const ct = slug[0];
    const ctTitle = ct.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const ctMessages = (messages as unknown as Record<string, Record<string, string>>)[ct];
    const title = ctMessages?.overviewTitle || `${ctTitle} — ${siteConfig.name}`;
    const description = ctMessages?.overviewDescription || `Browse all ${ctTitle.toLowerCase()} guides and resources for ${siteConfig.shortName}.`;
    return { title, description, alternates: { canonical: `/${locale}/${ct}`, languages: languageAlternates(`/${ct}`) }, openGraph: { title, description, url: `${siteUrl}/${locale}/${ct}`, images: [`${siteUrl}/images/hero.webp`] } };
  }
  const [contentType, ...articleSlug] = slug;
  const item = await getContent(contentType, articleSlug, locale);
  if (!item) return { title: "Not Found" };
  const pathname = `/${contentType}/${articleSlug.join("/")}`;
  const localizedPathname = `/${locale}${pathname}`;
  const image = item.metadata.image?.startsWith("http") ? item.metadata.image : `${siteUrl}${item.metadata.image ?? "/images/hero.webp"}`;
  return { title: `${item.metadata.title} — ${siteConfig.name}`, description: item.metadata.description, alternates: { canonical: localizedPathname, languages: languageAlternates(pathname) }, openGraph: { type: "article", title: item.metadata.title, description: item.metadata.description, url: `${siteUrl}${localizedPathname}`, images: [image] }, twitter: { card: "summary_large_image", images: [image] } };
}

export default async function SlugPage({ params }: { params: Promise<{ locale: Locale; slug: string[] }> }) {
  const { locale, slug } = await params;
  const navGroups = getDynamicNavigation(locale);
  if (slug.length === 1) return <NavigationPage locale={locale} contentType={slug[0]} navGroups={navGroups} />;
  return <DetailPage locale={locale} contentType={slug[0]} slug={slug.slice(1)} navGroups={navGroups} />;
}

async function NavigationPage({ locale, contentType, navGroups }: { locale: Locale; contentType: string; navGroups: import("@/lib/content").NavGroup[] }) {
  if (!CONTENT_TYPES.includes(contentType)) notFound();
  const messages = (await getMessages({ locale })) as Messages;
  const items = await getAllContent(contentType, locale);
  // sectionTitle/sectionDesc 必须声明在 listData 之前：const 存在暂时性死区（TDZ），
  // 顺序颠倒时静态导出会抛 ReferenceError，整批列表页构建失败。
  const sectionTitle = localizedSectionTitle(messages, contentType);
  const sectionDesc = (messages as unknown as Record<string, Record<string, string>>)[contentType]?.overviewDescription || "";
  const listData = { "@context": "https://schema.org", "@type": "ItemList", name: `${sectionTitle} — ${siteConfig.name}`, inLanguage: locale, itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, url: `${siteUrl}/${locale}/${contentType}/${item.slug}`, name: item.metadata.title })) };

  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><JsonLd data={listData} /><div className="mx-auto max-w-4xl"><article><Breadcrumbs items={[{ label: messages.shared.home, href: localizeHref("/", locale) }, { label: sectionTitle }]} /><h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">{sectionTitle}</h1>{sectionDesc && <p className="mt-5 text-lg leading-8 text-muted-foreground">{sectionDesc}</p>}<AdBanner size="728x90" className="mt-8" />{items.length > 0 && <><div className="mt-10 grid gap-4 sm:grid-cols-2">{items.map((item) => <Link key={`/${contentType}/${item.slug}`} href={localizeHref(`/${contentType}/${item.slug}`, locale)} className="group rounded-2xl border border-border bg-card/70 p-5 transition hover:-translate-y-0.5 hover:border-[hsl(var(--nav-theme-light))]"><div className="mb-4 flex items-center justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-[hsl(var(--nav-theme))]"><Swords className="h-5 w-5" /></span>{item.metadata.badge && <Badge variant="secondary">{item.metadata.badge}</Badge>}</div><h3 className="text-lg font-bold text-foreground group-hover:text-[hsl(var(--nav-theme))]">{item.metadata.title}</h3><p className="mt-2 min-h-[3rem] text-sm leading-6 text-muted-foreground">{item.metadata.description}</p><span className="mt-4 inline-flex items-center text-sm font-semibold text-[hsl(var(--nav-theme))]">{messages.shared.readMore}<ChevronRight className="ml-1 h-4 w-4" /></span></Link>)}</div><AdBanner size="300x250" className="mt-8" /></>}{items.length === 0 && <p className="mt-8 text-muted-foreground">{messages.shared.noGuidesAvailable}</p>}<AdBanner size="728x90" /></article></div></main>;
}

async function DetailPage({ locale, contentType, slug, navGroups }: { locale: Locale; contentType: string; slug: string[]; navGroups: import("@/lib/content").NavGroup[] }) {
  if (!CONTENT_TYPES.includes(contentType)) notFound();
  const messages = (await getMessages({ locale })) as Messages;
  const item = await getContent(contentType, slug, locale);
  if (!item) notFound();
  const pathname = `/${contentType}/${slug.join("/")}`;
  const localizedPathname = `/${locale}${pathname}`;
  const tocLabel = messages.shared.tableOfContents || messages.shared.inThisSection || "Table of Contents";
  const sectionLabel = localizedSectionTitle(messages, contentType);
  // metadata.image 可能是外链（http 开头）或站内相对路径，两种都要能拼成绝对 URL
  const articleImage = item.metadata.image?.startsWith("http") ? item.metadata.image : `${siteUrl}${item.metadata.image ?? "/images/hero.webp"}`;
  const articleData = { "@context": "https://schema.org", "@type": "Article", headline: item.metadata.title, description: item.metadata.description, image: articleImage, datePublished: item.metadata.date, dateModified: item.metadata.lastModified ?? item.metadata.date, inLanguage: locale, mainEntityOfPage: `${siteUrl}${localizedPathname}`, author: { "@type": "Organization", name: siteConfig.name }, publisher: { "@type": "Organization", name: siteConfig.name, logo: { "@type": "ImageObject", url: `${siteUrl}/android-chrome-512x512.png` } } };
  const breadcrumbData = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: messages.shared.home, item: `${siteUrl}/${locale}` }, { "@type": "ListItem", position: 2, name: sectionLabel, item: `${siteUrl}/${locale}/${contentType}` }, { "@type": "ListItem", position: 3, name: item.metadata.title, item: `${siteUrl}${localizedPathname}` }] };

  const relatedLabel = messages.shared.relatedGuides || "Related Guides";

  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><JsonLd data={articleData} /><JsonLd data={breadcrumbData} /><aside className="fixed top-20 z-10 hidden w-40 xl:block" style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}><AdBanner size="160x600" /></aside><aside className="fixed top-20 z-10 hidden w-40 xl:block" style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}><AdBanner size="160x300" /></aside><div className="mx-auto max-w-4xl"><article><Breadcrumbs items={[{ label: messages.shared.home, href: localizeHref("/", locale) }, { label: sectionLabel, href: localizeHref(`/${contentType}`, locale) }, { label: item.metadata.title }]} /><h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">{item.metadata.title}</h1><DismissibleStickyBanner closeLabel={messages.shared.closeAd} /><p className="mt-5 text-lg leading-8 text-muted-foreground">{item.metadata.summary ?? item.metadata.description}</p><MobileTOC headings={item.headings} label={tocLabel} closeLabel={messages.shared.close} /><div className="prose-invert mt-10 max-w-none"><item.MDXContent /></div><NativeBannerAd className="mt-10" /><AdBanner size="300x250" /><ArticleCards locale={locale} contentType={contentType} currentSlug={slug.join("/")} relatedLabel={relatedLabel} /><AdBanner size="728x90" /><AdBanner size="468x60" /></article></div></main>;
}

async function ArticleCards({ locale, contentType, currentSlug, relatedLabel }: { locale: string; contentType: string; currentSlug: string; relatedLabel: string }) {
  // 动态获取同分类其他文章（排除当前文章）
  const allItems = await getAllContent(contentType, locale as Locale);
  const related = allItems.filter((item) => item.slug !== currentSlug).slice(0, 4);

  if (related.length === 0) return null;

  return <div className="mt-12 space-y-8"><section><h3 className="text-xl font-bold text-foreground">{relatedLabel}</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{related.map((item) => <SmallCard key={item.slug} icon={<Swords className="h-5 w-5" />} title={item.metadata.title} description={item.metadata.description} href={localizeHref(`/${contentType}/${item.slug}`, locale)} />)}</div></section></div>;
}

function SmallCard({ title, description, href, icon }: { title: string; description: string; href: string; icon?: React.ReactNode }) { return <Link href={href} className="block rounded-2xl border border-border bg-card/70 p-5 transition hover:border-[hsl(var(--nav-theme-light))]">{icon && <div className="mb-3 text-[hsl(var(--nav-theme))]">{icon}</div>}<h4 className="font-bold text-foreground">{title}</h4><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></Link>; }
