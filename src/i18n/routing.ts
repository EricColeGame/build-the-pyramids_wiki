import { defineRouting } from "next-intl/routing";

/**
 * 全站语言集合（唯一真相源）。
 * 以下三处必须与本文件完全一致，否则语言切换/构建会出错：
 * - src/i18n/request.ts 的 messagesMap
 * - src/components/language-switcher.tsx 的 localeLabels
 * - src/locales/*.json 的文件名集合
 */
export const routing = defineRouting({
  locales: ["en", "es", "pt", "de"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/**
 * 生成 hreflang alternates 映射（如 "/about" → { en: "/en/about", es: "/es/about", ... }）。
 * 所有带 generateMetadata 的页面共用，避免各页面各写一份、漏掉某个语言。
 */
export function languageAlternates(pathname: string) {
  return Object.fromEntries(routing.locales.map((locale) => [locale, `/${locale}${pathname}`]));
}
