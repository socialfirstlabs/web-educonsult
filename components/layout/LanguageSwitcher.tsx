"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return locales.includes(segment as Locale)
    ? (segment as Locale)
    : defaultLocale;
}

function buildLocalizedPath(pathname: string, locale: Locale) {
  const segments = pathname.split("/");
  if (locales.includes(segments[1] as Locale)) {
    segments[1] = locale;
    return segments.join("/") || "/";
  }

  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${locale}${normalized}`;
}

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLocale = getLocaleFromPathname(pathname);

  const goToLocale = (locale: Locale) => {
    if (locale === currentLocale) return;
    const nextPath = buildLocalizedPath(pathname, locale);
    const query = searchParams.toString();
    const href = query ? `${nextPath}?${query}` : nextPath;
    router.push(href);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background p-1 text-sm">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => goToLocale(locale)}
            className={
              "rounded-full px-3 py-1 transition-colors " +
              (isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground")
            }
            aria-pressed={isActive}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
