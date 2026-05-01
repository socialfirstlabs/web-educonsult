import { en, type TranslationKey } from "@/locales/en";
import { ja } from "@/locales/ja";

export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  en,
  ja,
};

export function getT(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries.en;
  return (key: TranslationKey) => dict[key];
}
