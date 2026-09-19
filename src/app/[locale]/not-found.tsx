"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import pt from "@/locales/pt.json";
import de from "@/locales/de.json";

/**
 * 404 页。`output: "export"` + 无 middleware 时，[locale]/not-found.tsx 拿不到
 * params，也不保证被 NextIntlClientProvider 包裹（useTranslations 取不到 context
 * 会整页崩掉），因此改为从 pathname 首段推导 locale，并直接读语言包取文案。
 */
const notFoundMessages: Record<string, { title: string; description: string; cta: string }> = {
  en: en.notFound,
  es: es.notFound,
  pt: pt.notFound,
  de: de.notFound,
};

export default function NotFoundPage() {
  const pathname = usePathname();
  const segment = (pathname || "").split("/")[1];
  const locale = (routing.locales as readonly string[]).includes(segment) ? segment : routing.defaultLocale;
  const t = notFoundMessages[locale] ?? notFoundMessages[routing.defaultLocale];

  return (
    <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-16 text-center">
      <div className="rounded-3xl border border-border bg-card/70 p-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{t.title}</h1>
        <p className="mt-4 text-muted-foreground">{t.description}</p>
        <Button asChild className="mt-6"><Link href={`/${locale}/guide`}>{t.cta}</Link></Button>
      </div>
    </main>
  );
}
