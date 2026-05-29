/**
 * i18n Configuration — Single source of truth for locale settings.
 *
 * Used by:
 *  - `lib/i18n/index.ts` (dictionary lookup)
 *  - `app/[locale]/layout.tsx` (locale validation)
 *  - `components/layout/LanguageSwitcher.tsx` (UI switcher)
 *  - Middleware (if added later for redirect-based detection)
 */

/** All locales the application supports. */  
export const locales = ["en", "ja"] as const;

/** The fallback locale used when no match is found. */
export const defaultLocale = "en" as const;

/** Type of a valid locale string. */
export type Locale = (typeof locales)[number];

/** Human-readable metadata for each locale — used in the language switcher UI. */
export const localeConfig: Record<
  Locale,
  { label: string; nativeLabel: string; flag: string }
> = {
  en: {
    label: "English",
    nativeLabel: "English",
    flag: "🇺🇸",
  },
  ja: {
    label: "Japanese",
    nativeLabel: "日本語",
    flag: "🇯🇵",
  },
};

/**
 * Returns true if the given string is a supported locale.
 * Use this to validate the `[locale]` route segment.
 *
 * @example
 * if (!isValidLocale(params.locale)) notFound();
 */
export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}
