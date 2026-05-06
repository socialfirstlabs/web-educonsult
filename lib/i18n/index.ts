import { en, type TranslationKey } from "@/locales/en";
import { ja } from "@/locales/ja";

export { locales, defaultLocale, isValidLocale } from "./config";
export type { Locale } from "./config";

const dictionaries: Record<string, Record<TranslationKey, string>> = {
  en,
  ja,
};

export function getT(locale: string) {
  const dict = dictionaries[locale] ?? dictionaries.en;
  return (key: TranslationKey) => dict[key];
}
